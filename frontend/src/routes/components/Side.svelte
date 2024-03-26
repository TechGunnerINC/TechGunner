<script lang="ts">
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'

	let show = false

	function toggleMenu() {
		show = !show
	}

	onMount(() => {
		addEventListener('keydown', (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
				toggleMenu()
			}
			if (e.key === 'Escape' && show) {
				show = false
			}
		})
	})
</script>

<button on:click={toggleMenu} class="material-symbols-outlined menu" aria-label="Toggle menu">
	menu
</button>

{#if show}
	<button class="bg" on:click={toggleMenu} aria-label="Close menu"></button>
	<nav transition:fade={{ delay: 50, duration: 100 }}>
		<a class:act={$page.url.pathname === '/'} data-sveltekit-preload-data href="/">
			<b class="ico fa-solid fa-house-chimney"></b>
			<b class="link">Home</b>
		</a>
		<a class:act={$page.url.pathname === '/explore'} data-sveltekit-preload-data href="/explore">
			<b class="ico fa-solid fa-magnifying-glass"></b>
			<b class="link">Explore</b>
		</a>
		<a class:act={$page.url.pathname === '/messages'} data-sveltekit-preload-data href="/messages">
			<b class="ico fa-solid fa-envelope"></b>
			<b class="link">Messages</b>
		</a>
		<a class:act={$page.url.pathname === '/blogs'} data-sveltekit-preload-data href="/blogs">
			<b class="ico fa-solid fa-pen"></b>
			<b class="link">Blogs</b>
		</a>
		<a class:act={$page.url.pathname === '/courses'} data-sveltekit-preload-data href="/courses">
			<b class="ico fa-solid fa-user-graduate"></b>
			<b class="link">Courses and Tutorials</b>
		</a>
		<a
			class:act={$page.url.pathname === '/freelance'}
			data-sveltekit-preload-data
			href="/freelance">
			<b class="ico fa-solid fa-briefcase"></b>
			<b class="link">Freelance</b>
		</a>
		<a class:act={$page.url.pathname === '/tools'} data-sveltekit-preload-data href="/tools">
			<b class="ico fa-solid fa-wrench"></b>
			<b class="link">Tools</b>
		</a>
		<a
			class:act={$page.url.pathname === '/wallpapers'}
			data-sveltekit-preload-data
			href="/wallpapers">
			<b class="ico fa-solid fa-image"></b>
			<b class="link">Wallpapers</b>
		</a>
		<a class:act={$page.url.pathname === '/about'} data-sveltekit-preload-data href="/about">
			<b class="ico fa-solid fa-user"></b>
			<b class="link">About Me</b>
		</a>
		<a class:act={$page.url.pathname === '/contact'} data-sveltekit-preload-data href="/contact">
			<b class="ico fa-solid fa-comment"></b>
			<b class="link">Contact Me</b>
		</a>
		<a class:act={$page.url.pathname === '/projects'} data-sveltekit-preload-data href="/projects">
			<b class="ico fa-solid fa-landmark"></b>
			<b class="link">Our Projects</b>
		</a>
	</nav>
{/if}

<style>
	.bg {
		width: 100%;
		height: 100%;
		z-index: 100;
		position: fixed;
		background: rgba(14, 17, 32, 0.541);
	}
</style>
