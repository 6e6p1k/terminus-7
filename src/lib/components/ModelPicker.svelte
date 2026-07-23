<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';
	import { MODEL_NAMES, MODEL_TAGS, type ModelName } from '$lib/types';

	function select(name: ModelName) {
		store.currentModel = name;
		store.modelOpen = false;
	}
</script>

<!-- Backdrop -->
<button
	onclick={() => (store.modelOpen = false)}
	aria-label="Close model picker"
	class="fixed inset-0 z-35"
></button>

<div
	class="absolute z-40 min-w-[286px] animate-tm-boot"
	style="top: {store.isMobile ? 'calc(100% - 14px)' : 'calc(100% - 14px)'}; left: {store.isMobile ? '12px' : '24px'};
		background: #0b0b14; border: 2px solid {store.colors.cyan};
		box-shadow: 0 0 0 2px #07070c, 8px 8px 0 rgba({store.colors.magGlow},0.5), 0 0 24px rgba({store.colors.cyanGlow},0.35);
		clip-path: polygon(0 0,100% 0,100% 92%,96% 100%,0 100%);"
>
	<div
		class="px-3 py-2 text-base tracking-[2px] border-b"
		style="font-family: 'VT323', monospace; color: #07070c; background: {store.colors.cyan}; border-color: #07070c;"
	>
		◤ SELECT NEURAL MODEL
	</div>

	{#each MODEL_NAMES as name (name)}
		{@const active = name === store.currentModel}
		<button
			onclick={() => select(name)}
			class="flex items-center gap-2.5 w-full text-left cursor-pointer border-0 border-b py-2.5 px-3 text-xs tracking-[0.5px]"
			style="background: {active ? `rgba(${store.colors.cyanGlow},0.12)` : 'transparent'};
				border-color: rgba({store.colors.cyanGlow},0.14);
				color: {active ? store.colors.cyan : 'rgba(215,251,255,0.75)'};
				font-family: 'Share Tech Mono', monospace;"
			onmouseenter={(e) => { e.currentTarget.style.background = `rgba(${store.colors.cyanGlow},0.16)`; e.currentTarget.style.color = store.colors.cyan; }}
			onmouseleave={(e) => { e.currentTarget.style.background = active ? `rgba(${store.colors.cyanGlow},0.12)` : 'transparent'; e.currentTarget.style.color = active ? store.colors.cyan : 'rgba(215,251,255,0.75)'; }}
		>
			<span class="w-3.5 flex-shrink-0">{active ? '◆' : '◇'}</span>
			<span class="flex-1 text-[13px] tracking-[1px]">{name}</span>
			<span class="text-[9px] opacity-60 tracking-[1px] whitespace-nowrap">{MODEL_TAGS[name]}</span>
		</button>
	{/each}
</div>
