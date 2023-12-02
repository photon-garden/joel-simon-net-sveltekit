<script lang="ts">
	import Label from '$lib/components/Label.svelte'
	import Project from '$lib/components/Project.svelte'
	import HeadTags from '$lib/components/HeadTags.svelte'
	import { labels, projects } from './data'
	import { writable, type Writable } from 'svelte/store'

	const selectedLabel: Writable<string | null> = writable(null)
</script>

<HeadTags
	title="Joel Simon"
	description="Joel Simon Website portfolio project"
	imagePath="/imgs/cornered-hands/1.jpg"
	type="blog"
/>

<h1>Joel Simon</h1>
<div id="label-container">
	{#each labels as label}
		{#key label}
			<Label {label} {selectedLabel} />
		{/key}
	{/each}
</div>

<div id="project-container">
	{#each projects as project}
		{#key project.name}
			<Project {project} {selectedLabel} />
		{/key}
	{/each}
</div>
