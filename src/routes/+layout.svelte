<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
    <title>Komunikacja miejska - PBŚ</title>
</svelte:head>

{@render children()}
