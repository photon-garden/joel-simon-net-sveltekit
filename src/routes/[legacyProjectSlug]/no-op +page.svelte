<script lang="ts">
	import type { PageData } from './$types'
	import type { Project } from '$lib/types'
	import * as Projects from '$lib/Projects'
	import { browser } from '$app/environment'

	export let data: PageData

	// $: redirect(data.project)

	function redirect(project: Project) {
		if (!browser) {
			return
		}

		if (project == null) {
			throw new Error('Project not found.')
		}

		const href = Projects.getHref(project)
		window.location.href = href
	}
</script>

Redirecting to .html file...
