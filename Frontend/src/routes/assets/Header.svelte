<script lang="ts">
	import { onMount } from "svelte";

	onMount(() => {
		addEventListener("keyup", jump);
	});

	function jump(e: KeyboardEvent): any {
		const search = document.querySelector("#sea") as HTMLInputElement;

		if (
			e.key == "/" &&
			!(document.activeElement instanceof HTMLInputElement) &&
			!(document.activeElement instanceof HTMLTextAreaElement)
		) {
			search.focus();
		}
	}
</script>

<header>
	<span class="logo"
		><a data-sveltekit-preload-data href="/">
			<h3>Tech Gunner</h3>
		</a>
	</span>
	<div>
		<form class="sea">
			<i class="fa-solid fa-magnifying-glass p-2" /><input
				type="text"
				name="sea"
				class="s-box"
				id="sea"
				placeholder="Search..."
				autocomplete="off"
			/>
			<button type="reset"><i class="fa-solid fa-xmark p-2" /></button>
			<i class="fa-solid fa-magnifying-glass p-1" />
		</form>
	</div>

	<a data-sveltekit-preload-data href="/login" class="sec log">Login</a>

	<a data-sveltekit-preload-data href="/signup" class="prime sign">Sign up</a>
</header>
