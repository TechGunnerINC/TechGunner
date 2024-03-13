<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	let x = 0
	let y = 0
	let hover = false

	let elements

	const handleMouseMove = (event) => {
		x = event.clientX
		y = event.clientY
	}

	const handleHover = () => {
		hover = true
	}

	const handleHoverExit = () => {
		hover = false
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener('mousemove', handleMouseMove)

			elements = document.querySelectorAll('img, a, button')

			elements.forEach((element) => {
				element.addEventListener('mouseover', handleHover)
				element.addEventListener('mouseout', handleHoverExit)
			})
		}
	})

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('mousemove', handleMouseMove)

			elements.forEach((element) => {
				element.removeEventListener('mouseover', handleHover)
				element.removeEventListener('mouseout', handleHoverExit)
			})
		}
	})
</script>

<div class="cursor" class:hover style="left: {x}px; top: {y}px;" />
