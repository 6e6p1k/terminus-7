<script lang="ts">
	import './layout.css';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	afterNavigate(async () => {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.getRegistration();
			await registration?.update();
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
