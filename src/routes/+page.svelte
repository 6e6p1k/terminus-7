<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ChatFeed from '$lib/components/ChatFeed.svelte';
	import CommandInput from '$lib/components/CommandInput.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import { onMount } from 'svelte';

	let feedEl: HTMLDivElement;

	onMount(() => {
		store.loadChats();

		// handle resize
		function onResize() {
			const m = window.innerWidth < 900;
			if (m !== store.isMobile) {
				store.isMobile = m;
				store.sidebarOpen = false;
			}
		}
		window.addEventListener('resize', onResize);
		onResize();

		// clock tick
		const timer = setInterval(() => store.tick(), 1000);

		return () => {
			window.removeEventListener('resize', onResize);
			clearInterval(timer);
		};
	});

	// scroll to bottom when messages change
	$effect(() => {
		const _ = store.messages.length; // track changes
		if (feedEl) {
			requestAnimationFrame(() => {
				feedEl.scrollTop = feedEl.scrollHeight;
			});
		}
	});
</script>

<div
	class="relative h-screen w-full overflow-hidden flex"
	style="background: #07070c; color: {store.colors.text}; font-family: 'Share Tech Mono', monospace;"
>
	<!-- Scanlines -->
	{#if store.scanlines}
		<div class="fixed inset-0 pointer-events-none z-[900] mix-blend-multiply"
			style="background: repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.28) 3px, rgba(0,0,0,0) 4px);"
		></div>
		<div class="fixed left-0 right-0 top-0 h-[60px] pointer-events-none z-[902] animate-tm-scan"
			style="background: linear-gradient(180deg, rgba({store.colors.cyanGlow},0.10), rgba({store.colors.cyanGlow},0));"
		></div>
	{/if}

	<!-- Vignette -->
	<div class="fixed inset-0 pointer-events-none z-[901]"
		style="background: radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%);"
	></div>

	<Sidebar />

	<!-- Mobile toggle -->
	{#if store.isMobile}
		<button
			onclick={() => (store.sidebarOpen = !store.sidebarOpen)}
			class="absolute top-3 left-3 z-60 cursor-pointer w-11 h-11 border-0 text-[26px] leading-[44px] transition-all duration-[80ms]"
			style="background: {store.colors.cyan}; color: #07070c; font-family: 'VT323', monospace; box-shadow: 4px 4px 0 {store.colors.mag};"
			onmousedown={(e) => { e.currentTarget.style.transform = 'translate(3px,3px)'; e.currentTarget.style.boxShadow = `1px 1px 0 ${store.colors.mag}`; }}
			onmouseup={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `4px 4px 0 ${store.colors.mag}`; }}
		>
			≣
		</button>
	{/if}

	<!-- Main area -->
	<main class="flex-1 min-w-0 relative flex flex-col overflow-hidden">
		<CommandInput />
		<div bind:this={feedEl} class="flex-1 overflow-y-auto">
			<ChatFeed />
		</div>
	</main>

	<SettingsPanel />
</div>
