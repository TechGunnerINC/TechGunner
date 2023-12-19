<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const dynamicText = writable('');
	
	const words = [
		'An Overthinker',
		'A Gamer',
		'A Programmer',
		'The Creator of this website',
		'The CEO of Tech Gunner INC.',
		'The Founder of Tech Gunner INC.',
		'A Businessman',
		'An Entrepreneur',
		'A Full Stack Web Developer',
		'A Content Writer',
		'A Blogger',
		'A Photo Retoucher',
		'A UI/UX Designer',
		'A Student',
		'A Human',
		'A Muslim',
		'A Batman Fan',
	];

	let wordIndex = 0;
	let charIndex = 0;
	let isDeleting = true;

	const typeEffect = () => {
		const currentWord = words[wordIndex];
		const currentChar = currentWord.substring(0, charIndex);

		dynamicText.set(currentChar);

		if (!isDeleting && charIndex < currentWord.length) {
			charIndex++;
			setTimeout(typeEffect, 200);
		} else if (isDeleting && charIndex > 0) {
			charIndex--;
			setTimeout(typeEffect, 200);
		} else {
			isDeleting = !isDeleting;
			wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
			setTimeout(typeEffect, 1500);
		}
	};

	onMount(() => {
		typeEffect();
	});
</script>

<!-- Use the $ syntax to access the store value --> <span class="span"><b>{$dynamicText}</b></span>

<style>
	.span {
		color: #0effbd;
		position: relative;
	}
	.span::before {
		content: '';
		height: 40px;
		width: 2px;
		position: absolute;
		top: 50%;
		right: -8px;
		background: #0effbd;
		transform: translateY(-45%);
		animation: blink 1.5s infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
