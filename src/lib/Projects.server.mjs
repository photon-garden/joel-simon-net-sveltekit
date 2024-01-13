// This is an .mjs file because it's imported by both .mjs files (buildJade.mjs)
// and .ts files (routes/[legacyProjectSlug]/+server.ts).

import { packageDirectorySync } from 'pkg-dir'
import path from 'path'

const packageJsonDir = packageDirectorySync()

/**
 * @param {string} fileName 
 * @returns {string} The path to the legacy html file.
 */
export function getPathToLegacyHtml(fileName) {
    if (packageJsonDir == undefined) {
        throw new Error(`Couldn't find the directory that contains package.json.`)
    }

    return path.join(packageJsonDir, 'src/lib/previousVersion/builtTemplates', fileName)
}