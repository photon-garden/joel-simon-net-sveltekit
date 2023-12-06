// This file is written in JavaScript instead of TypeScript so we don't have to worry
// about compiling it. The .mjs extension is so we can use ES6 modules.

import fs from 'fs'
import jade from 'jade'
import jadeOptions from './jadeOptions.mjs'
import { packageDirectorySync } from 'pkg-dir'
import path from 'path'

// Gets the folder that contains the closest package.json.
const packageJsonDir = packageDirectorySync()

// Read all files in src/lib/previousVersion/templates
const templatesDir = path.join(packageJsonDir, 'src/lib/previousVersion/templates')
const pathsToTemplates = fs.readdirSync(templatesDir)
    .filter((filePath) => filePath.endsWith('.jade'))
    .map((filePath) => path.join(packageJsonDir, `src/lib/previousVersion/templates/${filePath}`))
console.log(`> Compiling ${pathsToTemplates.length} .jade files in ${templatesDir}.`)

for (const pathToTemplate of pathsToTemplates) {
    // Generate the html.
    const template = fs.readFileSync(pathToTemplate, 'utf8')
    const generateHtml = jade.compile(template, {
        basedir: templatesDir,
        filename: pathToTemplate,
        pretty: true
    })
    const html = generateHtml(jadeOptions)

    // Construct the path to the output files.
    const originalFilename = path.basename(pathToTemplate) // about.jade
    const newFilename = originalFilename.replace('.jade', '.html') // about.html
    const compiledPathWithHtml = path.join(packageJsonDir, 'static', newFilename) // /static/about.html
    // We generate two copies of the output file, one with the .html extension and one without.
    // This is so that users will see the same thing if they visit /about.html or /about.
    // const compiledPathWithoutHtml = compiledPathWithHtml.replace('.html', '')

    // Make sure the directory exists.
    const directory = compiledPathWithHtml.split('/').slice(0, -1).join('/')
    fs.mkdirSync(directory, { recursive: true })

    // Save the files.
    fs.writeFileSync(compiledPathWithHtml, html)
    // fs.writeFileSync(compiledPathWithoutHtml, html)
}