import type { Project } from '$lib/types'
import jadeConfigAndLocals from '$lib/previousVersion/jadeConfigAndLocals.mjs'

export const labels = Object.keys(jadeConfigAndLocals.publicData.labels)
export const projects: Project[] = jadeConfigAndLocals.publicData.projects
