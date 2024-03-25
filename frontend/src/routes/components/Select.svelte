<script lang="ts">
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'

	export let options: string[] = []
	export let value: string[] = []
	export let placeholder = 'Select...'
	export let multiSelect = false
	export let maxSelect = Infinity
	export let sortOptions = true
	export let showCount: boolean = false
	export let closeOnClickOutside: boolean = false

	let isOpen = false
	let selectedOptions: string[] = []
	let focusedIndex = -1

	$: sortedOptions = sortOptions ? [...options].sort((a, b) => a.localeCompare(b)) : options

	function handleClickOutside(e: MouseEvent) {
		if (closeOnClickOutside && isOpen && !(e.target as HTMLElement).closest('.select-wrapper')) {
			closeSelect()
		}
	}

	function shortcuts(e: KeyboardEvent) {
		if (!isOpen) return

		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault()
				if (focusedIndex > 0) {
					focusedIndex--
				}
				break
			case 'ArrowDown':
				e.preventDefault()
				if (focusedIndex < sortedOptions.length - 1) {
					focusedIndex++
				}
				break
			case 'Enter':
			case ' ':
				e.preventDefault()
				if (focusedIndex !== -1) {
					selectOption(sortedOptions[focusedIndex])
				}
				break
			case 'Escape':
				e.preventDefault()
				closeSelect()
				break
			default:
				if (/^[a-zA-Z]$/.test(e.key)) {
					let startIndex = focusedIndex === -1 ? 0 : focusedIndex + 1
					let foundIndex = -1
					for (let i = startIndex; i < sortedOptions.length; i++) {
						if (sortedOptions[i].toLowerCase().startsWith(e.key.toLowerCase())) {
							foundIndex = i
							break
						}
					}
					if (foundIndex === -1) {
						for (let i = 0; i < startIndex; i++) {
							if (sortedOptions[i].toLowerCase().startsWith(e.key.toLowerCase())) {
								foundIndex = i
								break
							}
						}
					}
					if (foundIndex !== -1) {
						focusedIndex = foundIndex
					}
				}
				e.stopPropagation()
		}
		focusOption()
	}

	function selectOption(option: string) {
		if (multiSelect) {
			const isSelected = selectedOptions.includes(option)

			if (isSelected) {
				selectedOptions = selectedOptions.filter((opt) => opt !== option)
			} else if (selectedOptions.length < maxSelect) {
				selectedOptions = [...selectedOptions, option]
			}
		} else {
			selectedOptions = [option]
			closeSelect()
		}
		value = selectedOptions.map((opt) => opt)
	}

	function toggleSelect() {
		isOpen = !isOpen
		if (!isOpen) {
			focusedIndex = -1
		}
	}

	function closeSelect() {
		isOpen = false
		focusedIndex = -1
	}

	function focusOption() {
		const optionElement = document.querySelector(
			`.options .option:nth-child(${focusedIndex + 1})`
		) as HTMLDivElement

		if (optionElement) {
			optionElement.focus()
		}
	}

	onMount(() => {
		if (closeOnClickOutside) {
			document.addEventListener('click', handleClickOutside)
		}

		return () => {
			if (closeOnClickOutside) {
				document.removeEventListener('click', handleClickOutside)
			}
		}
	})
</script>

<div class="select-wrapper">
	<div
		class="select"
		on:click={toggleSelect}
		on:keydown={shortcuts}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-label={placeholder}
		role="combobox"
		aria-controls="list"
		tabindex="0">
		{selectedOptions.length > 0 ? selectedOptions.join(', ') : placeholder}
	</div>
	{#if isOpen}
		<i class="fa-solid fa-angle-up relative bottom-7 left-44" />
	{:else}
		<i class="fa-solid fa-angle-down relative bottom-7 left-44" />
	{/if}
	{#if isOpen}
		<div
			class="options center-sh"
			role="listbox"
			id="list"
			transition:slide={{ delay: 50, duration: 500, axis: 'y' }}>
			{#each sortedOptions as option}
				<div
					class="option {selectedOptions.includes(option) && 'active'}"
					on:click={() => selectOption(option)}
					on:keydown={shortcuts}
					tabindex="0"
					role="option"
					aria-selected={selectedOptions.includes(option)}>
					{option}
					{#if selectedOptions.includes(option)}
						<i class="fa-solid fa-check relative left-24 top-[3px]" />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	{#if showCount}
		<div>
			{selectedOptions.length}/{maxSelect}
		</div>
	{/if}
</div>
