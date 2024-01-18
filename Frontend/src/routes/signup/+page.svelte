<script lang="ts">
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { genPass, int } from '$lib/Random'
	import { goto } from '$app/navigation'
	import type { Actions } from './$types'

	let Form: Actions

	onMount(() => {
		const pass = document.querySelector('#pass') as HTMLInputElement
		const gen = document.querySelector('.gen') as HTMLButtonElement

		gen.onclick = () => {
			pass.value = genPass(int(50, 85))
			pass.focus()
		}
		check()
		pass.oninput = check
		pass.onfocus = check
	})

	function show() {
		const x = document.querySelector('#pass') as HTMLInputElement
		x.type = x.type === 'password' ? 'text' : 'password'

		const eye = document.querySelector('.show') as HTMLButtonElement
		eye.innerHTML = eye.innerHTML === 'visibility' ? 'visibility_off' : 'visibility'
		x.focus()
	}

	function copy() {
		const pass = document.querySelector('#pass') as HTMLInputElement
		navigator.clipboard.writeText(pass.value)

		const copy = document.querySelector('.copy') as HTMLButtonElement
		copy.classList.add('fill')
		setTimeout(() => {
			copy.classList.remove('fill')
		}, 2000)
	}

	function check() {
		const count = document.querySelector('.count') as HTMLDivElement
		const pass = document.querySelector('#pass') as HTMLInputElement
		const length = document.querySelector('.length') as HTMLDivElement
		const pas = pass.value.length

		const low = /[a-z]/
		const up = /[A-Z]/
		const num = /[0-9]/
		const sym = /[\W_]/

		let passed = 0

		if (low.test(pass.value)) passed++
		if (up.test(pass.value)) passed++
		if (num.test(pass.value)) passed++
		if (sym.test(pass.value)) passed++

		if (
			num.test(pass.value) &&
			up.test(pass.value) &&
			low.test(pass.value) &&
			sym.test(pass.value) &&
			pas >= 50
		) {
			count.innerHTML = `Strength: Strong | Length: ${pas}`
			length.style.width = '430px'
			length.style.background = '#0effbd'
		} else if (up.test(pass.value) && low.test(pass.value) && pas >= 32) {
			count.innerHTML = `Strength: Medium | Length: ${pas}`
			length.style.width = '250px'
			length.style.background = '#fcba03'
		} else if (pas >= 1) {
			count.innerHTML = `Strength: Weak | Length: ${pas}`
			length.style.width = '50px'
			length.style.background = 'crimson'
		} else {
			count.innerHTML = 'Start typing to measure the Strength & Length of the password'
			length.style.width = '0'
		}
	}

	function submit() {
		const gub = document.querySelector('.gub') as HTMLButtonElement
		const loader = document.querySelector('.loader') as HTMLSpanElement
		gub.innerHTML = ''
		loader.style.display = 'block'
	}
</script>

<svelte:head>
	<title>Sign up - Tech Gunner</title>
	<meta name="description" content="Create a new Tech Gunner account" />
</svelte:head>

<div class="signup">
	<h2 class="text-center">Sign up</h2>
	<div class="at">@</div>
	<form class="s-form" method="POST" use:enhance on:submit|preventDefault={submit}>
		<input type="text" placeholder="Username" name="username" class="use" />
		<input type="text" name="name" placeholder="Full Name" />
		<input type="email" name="email" placeholder="E-mail" />
		<div class="pass">
			<input type="password" name="password" placeholder="Password" id="pass" />
		</div>
		<button on:click={copy} type="button" class="material-symbols-outlined copy"
			>content_copy</button>
		<button type="button" class="material-symbols-outlined show" on:click={show}>visibility</button>
		<div class="length" />
		<div class="count"></div>
		<span class="material-symbols-outlined lock">lock</span>
		<button class="gen" type="button">Auto Generate password</button>
		<button type="submit" class="prime gub w-[28em] mt-[40px] h-[30px]">Sign up</button>
	</form>
	<span class="loader absolute left-[31.6em] top-[18.55em]" />
	<a href="/login" class="ac">Already have an account? <b class="b underline"> Login</b></a>
</div>
