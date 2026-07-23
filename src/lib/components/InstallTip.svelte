<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'tm7-a2hs-dismissed';

	let visible = $state(false);
	let dismissed = $state(false);

	function isIosDevice() {
		const ua = navigator.userAgent;
		return (
			/iPad|iPhone|iPod/.test(ua) ||
			(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
		);
	}

	function isStandalone() {
		return (
			('standalone' in navigator &&
				Boolean((navigator as Navigator & { standalone?: boolean }).standalone)) ||
			window.matchMedia('(display-mode: standalone)').matches
		);
	}

	function refresh() {
		if (dismissed) {
			visible = false;
			return;
		}
		visible = isIosDevice() && !isStandalone() && store.isMobile;
	}

	onMount(() => {
		try {
			dismissed = localStorage.getItem(STORAGE_KEY) === '1';
		} catch {
			/* private mode */
		}
		refresh();
	});

	$effect(() => {
		store.isMobile;
		if (typeof window === 'undefined') return;
		refresh();
	});

	function dismiss() {
		dismissed = true;
		visible = false;
		try {
			localStorage.setItem(STORAGE_KEY, '1');
		} catch {
			/* ignore */
		}
	}
</script>

{#if visible}
	<div
		class="fixed z-[950] left-3 right-3"
		style="bottom: calc(12px + env(safe-area-inset-bottom, 0px)); font-family: 'Share Tech Mono', monospace;"
		role="dialog"
		aria-label="Install TERMINUS·7"
	>
		<div
			class="relative px-3 py-3"
			style="background: #0b0b14; border: 2px solid {store.colors.cyan}; box-shadow: 4px 4px 0 rgba({store.colors.magGlow},0.55); color: {store.colors.text};"
		>
			<div
				class="tracking-[2px] mb-1"
				style="font-family: 'VT323', monospace; font-size: 18px; color: {store.colors.cyan};"
			>
				INSTALL // HOME SCREEN
			</div>
			<p class="m-0 text-[11px] leading-relaxed pr-5" style="color: rgba(185,247,255,0.75);">
				Safari → Share → <span style="color: {store.colors.mag};">Add to Home Screen</span>
			</p>
			<button
				type="button"
				onclick={dismiss}
				class="absolute top-1 right-2 cursor-pointer bg-transparent border-0 text-[18px] leading-none"
				style="color: {store.colors.cyan}; font-family: 'VT323', monospace;"
				aria-label="Dismiss"
			>
				×
			</button>
		</div>
	</div>
{/if}
