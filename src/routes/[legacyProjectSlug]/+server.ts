import { projects } from '$lib/data'
import * as Projects from '$lib/Projects'
import * as ProjectsServer from '$lib/Projects.server.mjs'
import * as StatusCodes from '$lib/StatusCodes'
import { error, redirect } from '@sveltejs/kit'
import { promises as fs } from 'fs'

// Tell SvelteKit about all the legacy projects so it knows to prerender them.
/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return projects.map((project) => {
		const slug = Projects.getSlug(project)
		return { slug, legacyProjectSlug: slug }
	})
}

/** @type {import('./$types').RequestHandler} */
export async function GET(requestEvent) {
	const pathname = requestEvent.url.pathname
	console.log('GET', pathname)

	const projectSlug = requestEvent.params.legacyProjectSlug
	if (pathname.endsWith('.html')) {
		const withoutHtmlExtension = pathname.slice(0, -5)
		console.log('Redirecting to', withoutHtmlExtension)
		throw redirect(StatusCodes.seeOther, withoutHtmlExtension)
	}

	const html = await getProjectHtml(projectSlug)

	const headers = new Headers()
	const sizeInBytes = new Blob([html]).size
	console.log(`Found ${sizeInBytes} bytes of HTML for ${projectSlug}.`)
	headers.set('content-length', sizeInBytes.toString())
	headers.set('content-type', 'text/html')

	return new Response(html, {
		headers
	})
}

async function getProjectHtml(projectSlug: string): Promise<string> {
	const projectHtmlPath = ProjectsServer.getPathToLegacyHtml(`${projectSlug}.html`)
	console.log('Reading project HTML at', projectHtmlPath)

	try {
		const projectHtml = await fs.readFile(projectHtmlPath, 'utf8')
		return projectHtml
	} catch (originalError) {
		console.error('Error reading project HTML at', projectHtmlPath)
		console.error(originalError)
		// This will usually be a file not found error.
		throw error(StatusCodes.notFound)
	}
}
