<script lang="ts">
	import type { Project } from '$lib/types'
	import Label from '$lib/components/Label.svelte'
	import type { Writable } from 'svelte/store'

	export let project: Project
	export let selectedLabel: Writable<string | null>

	$: state = getState(project, $selectedLabel)

	interface State {
		labels: string[]
		classes: string
		path: string
		target: string
		kebabCaseName: string
		visible: boolean
	}

	function getState(project: Project, selectedLabel: string | null): State {
		const visible = isVisible(project, selectedLabel)
		const labels = getLabels(project)

		const kebabCaseName = project.name.replace(/\s+/g, '-').toLowerCase()
		const classes = [...labels, kebabCaseName].join(' ')

		const path = getPath(project, kebabCaseName)
		const target = project.externalPath ? '_blank' : ''

		return {
			visible,
			labels,
			classes,
			path,
			target,
			kebabCaseName
		}
	}

	function isVisible(project: Project, selectedLabel: string | null): boolean {
		if (selectedLabel == null) {
			return true
		}

		return project.labels.includes(selectedLabel) || project.year?.toString() === selectedLabel
	}

	function getLabels(project: Project): string[] {
		// Make a copy of the labels array so we don't mutate the original.
		const labels = [...project.labels]
		if (project.year) {
			labels.push(project.year.toString())
		}

		return labels
	}

	function getPath(project: Project, kebabCaseName: string): string {
		if (project.path) {
			return `${project.path}.html`
		}

		if (project.externalPath) {
			return project.externalPath
		}

		return `${kebabCaseName}.html`
	}
</script>

{#if !project.hide}
	<div class="project {state.classes}" style="display: {state.visible ? 'inline-block' : 'none'}">
		<!-- <a href={state.path} target={state.target}> -->
		<a href={'/'} target={state.target}>
			<div class="preview-container">
				<img src={project.img} alt={project.name} title={project.name} />
				<div class="description-container">
					{#if project.description}
						<p class="description">{project.description}</p>
					{/if}
				</div>
			</div>
			<div class="project-content show-on-hover">
				<h3 class="project-name">{project.name}</h3>
				<div class="project-labels">
					{#each state.labels as label}
						<Label {label} {selectedLabel} />
					{/each}
				</div>
			</div>
		</a>
	</div>
{/if}
