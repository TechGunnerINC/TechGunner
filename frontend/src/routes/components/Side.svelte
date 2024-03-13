<script lang="ts">
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'

	let show = false

	function open() {
		show = !show
	}

	onMount(() => {
		addEventListener('keydown', (e: KeyboardEvent) => {
			if ((e.ctrlKey && e.key == ' ') || (e.metaKey && e.key == ' ')) {
				open()
			}
			if (e.key === 'Escape' && show === true) {
				show = false
			}
		})
	})
</script>

{#if show}
	<button class="bg" on:click={open} />
{/if}

<button on:click={open} class="material-symbols-outlined menu"> menu </button>

{#if show}
	<nav transition:fade={{ delay: 50, duration: 100 }}>
		{#each ['/', '/explore', '/messages', '/blogs', '/courses', '/freelance', '/tools', '/wallpapers', '/about', '/contact', '/projects'] as link}
			<a class:act={$page.url.pathname === link} data-sveltekit-preload-data href={link}>
				<b
					class="ico fa-solid"
					class:fa-house-chimney={link === '/'}
					class:fa-magnifying-glass={link === '/explore'}
					class:fa-envelope={link === '/messages'}
					class:fa-pen={link === '/blogs'}
					class:fa-user-graduate={link === '/courses'}
					class:fa-briefcase={link === '/freelance'}
					class:fa-wrench={link === '/tools'}
					class:fa-image={link === '/wallpapers'}
					class:fa-user={link === '/about'}
					class:fa-comment={link === '/contact'}
					class:fa-landmark={link === '/projects'} /><b class="link"
					>{link === '/explore'
						? 'Explore'
						: link === '/messages'
							? 'Messages'
							: link === '/blogs'
								? 'Blogs'
								: link === '/courses'
									? 'Courses and Tutorials'
									: link === '/freelance'
										? 'Freelance'
										: link === '/tools'
											? 'Tools'
											: link === '/wallpapers'
												? 'Wallpapers'
												: link === '/about'
													? 'About Me'
													: link === '/contact'
														? 'Contact Me'
														: link === '/projects'
															? 'Our Projects'
															: 'Home'}</b>
			</a>
		{/each}
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
