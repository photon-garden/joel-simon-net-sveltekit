<script lang="ts">
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import type { Project } from '$lib/types'
	import * as Projects from '$lib/Projects'
	import { browser } from '$app/environment'

	export let data: PageData

	$: redirect(data.project)

	function redirect(project: Project) {
		if (!browser) {
			return
		}

		if (project == null) {
			throw new Error('Project not found.')
		}

		const href = Projects.getHref(project)
		goto(href)
	}
</script>
