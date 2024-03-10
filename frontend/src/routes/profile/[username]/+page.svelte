<script lang="ts">
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import axios from 'axios'

	export let data: PageData
	const { user } = data
	onMount(() =>
		user.links.forEach(async (element) => {
			const favicon = await axios.get(`https://icons.duckduckgo.com/ip3/${element}.ico`)
			console.log(favicon.data)
			const link = document.getElementById('favicon') as HTMLImageElement
			link.src = favicon.data
		})
	)
</script>

<svelte:head>
	<title>{user.name} - Tech Gunner</title>
	<meta name="description" content={user.about} />
</svelte:head>

<div class="banner">
	<img src={user.banner} alt="banner" width="100%" height="100%" />
</div>

<section class="pro">
	<img src={user.pp} alt="Profile Picture" />
	<h3>{user.name}</h3>
	<b>{user.username}</b>
	<b>{user.followers} </b>
	<b class="text-gray-400">Followers</b>
	<button class="prime h-[28px] w-[12rem]">Follow</button>
	<b class="left">About:</b>
	<p>{user.about}</p>
	{#each user.links as link}
		<a href={link}><img alt="" id="favicon" /></a>
	{/each}
	<b class="left">Level: {user.level}</b>
	<b class="left">Points: {user.points}</b>
	{#if !user.skills.name}{:else}
		<b>Skills:</b>
		<ul>
			{#each user.skills as skill}
				<li>{skill.name}</li>
				<li>{skill.level}</li>
			{/each}
		</ul>
	{/if}
	{#if !user.languages.name}{:else}
		<b>Languages:</b>
		<ul>
			{#each user.languages as language}
				<li>{language.name}</li>
				<li>{language.level}</li>
			{/each}
		</ul>
	{/if}
</section>
