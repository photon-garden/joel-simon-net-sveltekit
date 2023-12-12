import { projects } from '$lib/data'
import * as Projects from '$lib/Projects'
import * as StatusCodes from '$lib/StatusCodes'
import { error } from '@sveltejs/kit'

// Tell SvelteKit about all the legacy projects.
/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return projects.map((project) => {
		const slug = Projects.getSlug(project)
		return { slug, legacyProjectSlug: slug }
	})
}

// Find the relevant project and pass it to +page.svelte.
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const desiredSlug = params.legacyProjectSlug

	const project = projects.find((project) => {
		const slug = Projects.getSlug(project)
		return slug === desiredSlug
	})

	console.debug('project', project)

	if (project == null) {
		throw error(StatusCodes.notFound)
	}

	return {
		project
	}
}
