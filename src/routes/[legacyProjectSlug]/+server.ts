import { projects } from '$lib/data'
import * as Projects from '$lib/Projects'
import * as StatusCodes from '$lib/StatusCodes'
import { error, redirect } from '@sveltejs/kit'

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
	// import.meta.glob is a Vite function that imports the files at build time.
	//
	// Using the file system to read the files at runtime would be more straightforward,
	// and it worked locally in both dev and production mode, but broke on Vercel.
	//
	// Details here: https://vitejs.dev/guide/features#glob-import
	const htmlFiles = import.meta.glob('../../lib/previousVersion/builtTemplates/*.html', {
		as: 'raw',
		eager: true
	})
	const projectHtmlPath = `../../lib/previousVersion/builtTemplates/${projectSlug}.html`
	const htmlFile = htmlFiles[projectHtmlPath]

	if (htmlFile == undefined) {
		throw error(StatusCodes.notFound)
	}

	return htmlFile
}
