import type { Project } from '$lib/types'

/** If a project has the name 'Artbreeder interviews', returns 'artbreeder-interviews'. */
export function getSlug(project: Project): string {
	return project.name.replace(/\s+/g, '-').toLowerCase()
}

export function getHref(project: Project): string {
	const slug = getSlug(project)

	if (project.path) {
		return project.path + '.html'
	}

	if (project.externalPath) {
		return project.externalPath
	}

	return slug + '.html'
}
