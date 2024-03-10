<script>
	import './style.css'
	import Header from './components/Header.svelte'
	import Side from './components/Side.svelte'
	import Cursor from './components/Cursor.svelte'
</script>

<Header />
<Side />
<Cursor />
<main>
	<slot />
</main>
