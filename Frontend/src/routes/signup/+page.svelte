<script lang="ts">
	import { onMount } from "svelte";
	import { enhance } from "$app/forms";
	import str from "@supercharge/strings";
	import type { ActionData } from "./$types";

	export let form: ActionData;

	onMount(() => {
		const pass = document.querySelector("#pass") as HTMLInputElement;
		check();
		pass.oninput = check;
		pass.onfocus = check;
	});

	function int(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function genPass() {
		const pass = document.querySelector("#pass") as any;
		const up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const low = "abcdefghijklmnopqrstuvwxyz";
		const num = "0123456789";
		const sym = "`~!@#$%^&*()-_=+[]{}|;:',.<>/?";
		const spacial =
			"€£¥©®™÷×§¶°¨≠∞µαβγδεζηθικλμνξÄÅÉæÆôöòûùよかとカく➾⟁⟂⟃⟄⟅⟆⟇⟈⟉⟊⟋⟌⟍⟎⟏⟐⟑⟒⟓⟔⟕⟖⟗⟘⟙⟚⟛⟜⟝⟞⟟⟠⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫⟬⟭⟮⟯⟰⟱⟲⟳⟴⟵⟶⟷⟸⟹⟺⟻⟼⟽⟾⟿ÿÖÜø£ß¢₩₱°²³ªº¿⌐¬½¼¡«»┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌αßΓπΣστΦΘδφε∩≡±≥≤⌠⌡≈·√ⁿ²ⱭⱮⱯⱰⱱⱲⱳⱴⱵⱶⱷⱸⱹⱺⱻⱼⱽⱾⱿⲀⲁⲂⲃⲄⲅⲆⲇⲈⲉⲊⲋⲌⲍⲎⲏⲐⲑⲒⲓⲗⲘⲜⲝⲞⲟⲠⲡⲢⲣⲤⲥⲦⲧⲨⲩⲪⲫⲬⲭⲮⲯⲲⲳⲴⲵⲶⲷⲸⲹⲺⲻⲼⲽⲾⲿⳀⳁⳄⳅⳆⳇⳈⳉⳊⳋⳌⳍⳎⳏⳐⳑⳒⳓⳔⳕⳖⳗⳘⳙⳚⳛⳜⳝⳞⳟⳠⳡⳢⳣⳤ⳥⳦⳧⳨⳩⳪ⳫⳬⳭⳮ⳯🜀🜁🜂🜃🜄🜅🜆🜇🜈🜉🜊🜋🜌🜍🜎🜏🜐🜑🜒🜓🜔🜕🜖🜗🜘🜙🜚🜛🜜🜝🜞🜟🜠🜡🜢🜣🜤🜥🜦🜧🜨🜩🜪🜫🜬🜭🜮🜯🜰🜱🜲🜳🜴🜵🜶🜷🜸🜹🜺🜻🜼🜽🜾🜿🝀🝁🝂🝃🝄🝅🝆🝇🝈🝉🝊🝋🝌🝍🝎🝏🝐🝑🝒🝓🝔🝕🝖🝗🝘🝙🝚🝛🝜🝝🝞🝟🝠🝡🝢🝣🝤🝥🝦🝧🝨🝩🝪🝫🝬🝭🝮🝯🝰🝱🝲🝳";

		let password = [];
		let length: any = int(50, 83);

		function randomIndex(set: any) {
			let byte: any = int(1, 528193);
			let index = byte % set.length;
			return index;
		}

		function isSimilarOrSequential(char: any, prev: any) {
			const similar = "il1Lo0O";
			const sequential = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			if (similar.includes(char) && similar.includes(prev)) {
				return true;
			}
			let index = sequential.indexOf(char);
			if (index > -1 && (sequential[index - 1] === prev || sequential[index + 1] === prev)) {
				return true;
			}
			return false;
		}

		password.push(up[randomIndex(up)]);
		password.push(low[randomIndex(low)]);
		password.push(num[randomIndex(num)]);
		password.push(sym[randomIndex(sym)]);
		password.push(spacial[randomIndex(spacial)]);

		for (let i = password.length - 1; i > 0; i--) {
			let j = randomIndex(password);
			[password[i], password[j]] = [password[j], password[i]];
		}

		for (let i = 4; i < length; i++) {
			let set = [up, low, num, sym, spacial][randomIndex([up, low, num, sym, spacial])];
			let char = set[randomIndex(set)];
			let prev = password[i - 1];
			while (isSimilarOrSequential(char, prev)) {
				char = set[randomIndex(set)];
			}
			password.push(char);
		}

		pass.value = password.join("");
		pass.focus();
	}

	function show() {
		const x = document.querySelector("#pass") as HTMLInputElement;
		x.type = x.type === "password" ? "text" : "password";

		const eye = document.querySelector(".show") as HTMLButtonElement;
		eye.innerHTML = eye.innerHTML === "visibility" ? "visibility_off" : "visibility";
		x.focus();
	}

	function copy() {
		const pass = document.querySelector("#pass") as HTMLInputElement;
		navigator.clipboard.writeText(pass.value);

		const copy = document.querySelector(".copy") as HTMLButtonElement;
		copy.classList.add("fill");
		setTimeout(() => {
			copy.classList.remove("fill");
		}, 2000);
	}

	function check() {
		const count = document.querySelector(".count") as HTMLDivElement;
		const pass = document.querySelector("#pass") as HTMLInputElement;
		const length = document.querySelector(".length") as HTMLDivElement;
		const pas = pass.value.length;

		const low = /[a-z]/;
		const up = /[A-Z]/;
		const num = /[0-9]/;
		const sym = /[\W_]/;

		let passed = 0;

		if (low.test(pass.value)) passed++;
		if (up.test(pass.value)) passed++;
		if (num.test(pass.value)) passed++;
		if (sym.test(pass.value)) passed++;

		if (
			num.test(pass.value) &&
			up.test(pass.value) &&
			low.test(pass.value) &&
			sym.test(pass.value) &&
			pas >= 50
		) {
			count.innerHTML = `Strength: Strong | Length: ${pas}`;
			length.style.width = "430px";
			length.style.background = "#0effbd";
		} else if (up.test(pass.value) && low.test(pass.value) && pas >= 32) {
			count.innerHTML = `Strength: Medium | Length: ${pas}`;
			length.style.width = "250px";
			length.style.background = "#fcba03";
		} else if (pas >= 1) {
			count.innerHTML = `Strength: Weak | Length: ${pas}`;
			length.style.width = "50px";
			length.style.background = "crimson";
		} else {
			count.innerHTML = "Start typing to measure the Strength & Length of the password";
			length.style.width = "0";
		}
	}

	function submit() {
		const gub = document.querySelector(".gub") as HTMLButtonElement;
		const user = document.querySelector(".use") as any;

		const User = `@${str(user.pascal().replaceAll(" ", "").get())}`;

		gub.innerHTML = "";
		gub.classList.add("loader");

		if (form?.success) {
			window.location.href = `/profile/${User}`;
		}
	}
</script>

<svelte:head>
	<title>Sign up - Tech Gunner</title>
	<meta name="description" content="Create a new Tech Gunner account" />
</svelte:head>
<main>
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
				>content_copy</button
			>
			<button type="button" class="material-symbols-outlined show" on:click={show}
				>visibility</button
			>
			<div class="length" />
			<div class="count"></div>
			<span class="material-symbols-outlined lock">lock</span>
			<button on:click={genPass} class="gen" type="button">Auto Generate password</button>
			<button type="submit" class="prime gub w-[28em] mt-[40px]">Sign up</button>
		</form>
		<a href="/login" class="ac">Already have an account? <b class="b underline"> Login</b></a>
	</div>
	{#if form?.err} 
	<div class="err">{form?.err}</div>
	{/if}
</main>
