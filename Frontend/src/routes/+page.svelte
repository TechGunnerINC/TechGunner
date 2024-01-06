<script>
	import Type from "./assets/Type.svelte";
</script>

<svelte:head>
	<title>Tech Gunner</title>
	<meta name="description" content="The official site of Tech Gunner" />
</svelte:head>

<main class="p-[20px]">
	<section class="mt-[6rem]">
		<h1>
			Assalamu Alaikum Dear Visitor. <br /> I am <b class="b">Tech Gunner</b> <br />
			I'm <Type /> <br />
			from <b class="b">Islamabad, Pakistan.</b>
		</h1>
		<p>
			<br />
			I am deeply honored that you've taken the time to explore my website,<br /> which I created
			with the help of Bing's AI, ChatGPT. <br /> my staff is also working hard to upgrade this
			platform to the <br />
			next level. However, creating this website was not easy for me
			<br />
			I have some physical disabilities that affect my mobility and speech. <br />
		</p>
		<br />
		<a data-sveltekit-preload-data href="/about" class="prime">Read more</a>
		<img
			src="/logo.jpg"
			alt="logo"
			width="550"
			loading="lazy"
			class="mx-[75rem] tg-logo mt-[-37rem]"
		/>
	</section>
</main>
