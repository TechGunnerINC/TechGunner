<script lang="ts">
	import { onMount } from 'svelte'
	let x = 0
	let y = 0
	let cursor: any
	let ho = false

	onMount(() => {
		cursor = document.querySelector('.cursor')
		document.addEventListener('mousemove', (e) => {
			x = e.clientX
			y = e.clientY
		})

		document.querySelectorAll('a, img, button').forEach((element) => {
			element.addEventListener('mouseenter', () => {
				ho = true
				cursor.classList.add('hover')
			})
			element.addEventListener('mouseleave', () => {
				ho = false
				cursor.classList.remove('hover')
			})
		})

		const animate = () => {
			cursor.style.transform = `translate(${x}px, ${y}px)`
			requestAnimationFrame(animate)
		}
		animate()
	})
</script>

<div class="cursor" style="top: {y}; left: {x};" />
