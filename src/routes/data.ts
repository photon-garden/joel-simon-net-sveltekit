import type { Project } from '$lib/types'
import jadeOptions from '$lib/previousVersion/jadeOptions.mjs'

export const labels = Object.keys(jadeOptions.publicData.labels)
export const projects: Project[] = jadeOptions.publicData.projects
