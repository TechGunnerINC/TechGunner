<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
	const { user } = data
	const { state } = data
</script>

<svelte:head>
	<title>{user.name} - Tech Gunner</title>
	<meta name="description" content={user.about} />
</svelte:head>
<div class="banner">
	<img src={user.banner} alt="banner" width="100%" height="100%" />
</div>

<section class="pro">
	<img src={user.pp} alt="Profile Pic" />
	<h3>{user.name}</h3>
	<b>{user.username}</b>
	<b>{user.followers} </b>
	<b class="text-gray-400">Followers</b>
	{#if state === 'owner'}
		<button class="prime h-[28px] w-[12rem]">Edit</button>
	{/if}
	<button class="prime h-[28px] w-[12rem]">Follow</button>
	<b class="left">About:</b>
	<p>{user.about}</p>
	{#each user.links as link}
		<a href={link}><img src="" alt="" /></a>
	{/each}
	<b class="left">Level: {user.level}</b>
	<b class="left">Points: {user.points}</b>
	<b>Skills:</b>
	<ul>
		{#each user.skills as skill}
			<li>{skill}</li>
		{/each}
	</ul>
	<b>Languages:</b>
	<ul>
		{#each user.languages as language}
			<li>{language}</li>
		{/each}
	</ul>
</section>
