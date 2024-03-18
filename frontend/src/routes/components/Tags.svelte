<script lang="ts">
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import type { Unsubscriber } from 'svelte/store'

	interface Tag {
		value: string
		editable: boolean
	}

	let tagsStore = writable<Tag[]>([])
	let inputValue: string = ''
	let tags: Tag[] = []
	export let maxTags = 30

	let undoStack: Tag[][] = []
	let redoStack: Tag[][] = []

	let unsubscribeTagsStore: Unsubscriber

	function addTag(tag: string) {
		const trimmedTag = tag.trim()
		if (trimmedTag !== '' && tags.length < maxTags && !tags.some((t) => t.value === trimmedTag)) {
			tagsStore.update((value) => {
				const newValue = [...value, { value: trimmedTag, editable: false }]
				undoStack.push([...value])
				redoStack = []
				return newValue
			})
			inputValue = ''
		}
	}

	function removeTag(index: number) {
		tagsStore.update((value) => {
			const newValue = value.filter((_, i) => i !== index)
			undoStack.push([...value])
			redoStack = []
			return newValue
		})
	}

	function shortcuts(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
			event.preventDefault()
			addTag(inputValue)
		}

		if (event.ctrlKey && event.key === 'z') {
			undo()
		}

		if (event.ctrlKey && event.key === 'y') {
			redo()
		}
	}

	function undo() {
		if (undoStack.length > 0) {
			redoStack.push([...tags])
			tagsStore.set(undoStack.pop() || [])
		}
	}

	function redo() {
		if (redoStack.length > 0) {
			undoStack.push([...tags])
			tagsStore.set(redoStack.pop() || [])
			setTimeout(() => {
				inputValue = ''
			}, 0)
		}
	}
	function toggleEdit(index: number) {
		tags[index].editable = !tags[index].editable
		const input = document.querySelector('.edit-tag-' + index) as HTMLInputElement

		if (tags[index].editable) {
			setTimeout(() => {
				input.focus()
			}, 0)
		}
	}

	function handleTagEditKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
			tags[index].editable = false
			addTag(tags[index].value)
		} else if (event.key === 'Escape') {
			tags[index].editable = false
		}
	}

	function handlePaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData

		if (!clipboardData) {
			return
		}

		const pastedText = clipboardData.getData('text') || ''
		const pastedTags = pastedText.split(/[,\s]+/)

		const uniquePastedTags = pastedTags
			.map((tag) => tag.trim())
			.filter((tag, index, self) => tag !== '' && self.indexOf(tag) === index)

		if (tags.length + uniquePastedTags.length > maxTags) {
			uniquePastedTags.splice(maxTags - tags.length)
		}

		tagsStore.update((value) => {
			const newValue = [
				...value,
				...uniquePastedTags.map((tag) => ({ value: tag, editable: false }))
			]
			undoStack.push([...value])
			redoStack = []
			return newValue
		})
		setTimeout(() => {
			inputValue = ''
		}, 1)
	}

	function setWidthHeight(tagsCount: number) {
		const tagBox = document.querySelector('.tags-input') as HTMLDivElement
		if (tagsCount >= 10) {
			tagBox.style.width = '50rem'
			tagBox.style.height = '10rem'
		} else if (tagsCount >= 20) {
			tagBox.style.height = '15rem'
		} else if (tagsCount >= 30) {
			tagBox.style.height = '20rem'
		} else {
			tagBox.style.width = 'auto'
		}
	}

	onMount(() => {
		unsubscribeTagsStore = tagsStore.subscribe((value) => {
			tags = value
			setWidthHeight(tags.length)
		})

		window.addEventListener('keydown', shortcuts)

		return () => {
			unsubscribeTagsStore()
			window.removeEventListener('keydown', shortcuts)
		}
	})

	$: tagsCount = tags.length
</script>

<div class="tags-input">
	{#each tags as tag, index (tag)}
		<div class="tag-container">
			<div class="hash">#</div>
			<button class="tag" on:click={() => toggleEdit(index)}>
				{#if tag.editable}
					<input
						type="text"
						bind:value={tag.value}
						on:keydown={(e) => handleTagEditKeyDown(e, index)}
						class={'edit-tag edit-tag-' + index} />
				{:else}
					<b>{tag.value}</b>
					<button class="fa-solid fa-xmark relative top-[2px]" on:click={() => removeTag(index)} />
				{/if}
			</button>
		</div>
	{/each}
	<div class="flex">
		<div class="hash mt-[5px]">#</div>
		<input
			type="text"
			bind:value={inputValue}
			placeholder="Tags"
			on:keydown={shortcuts}
			on:paste={handlePaste}
			class="ted" />
	</div>
</div>
<div>{tagsCount}/{maxTags}</div>
