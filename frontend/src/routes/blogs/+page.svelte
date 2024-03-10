<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
	const { blogs } = data
	console.log(blogs)
</script>

{#each blogs as blog}
	{blog.id}
{/each}
