<script lang="ts">
	import type { Message } from '$lib/types';
	import { store } from '$lib/stores/chat.svelte';

	let { msg, i }: { msg: Message; i: number } = $props();

	const isAI = $derived(msg.role === 'assistant');
	const rot = $derived(store.stagger ? ((i % 2 === 0 ? -1 : 1) * (0.5 + (i % 3) * 0.35)) : 0);
	const push = $derived(store.stagger ? (i % 3) * 22 : 0);
	const accent = $derived(isAI ? store.colors.cyan : store.colors.mag);
	const stamp = $derived(new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
</script>

<div
	class="animate-tm-boot"
	style="max-width: {store.isMobile ? '92%' : '68%'};
		align-self: {isAI ? 'flex-start' : 'flex-end'};
		margin-top: {i === 0 ? '10px' : (store.stagger ? '22px' : '16px')};
		margin-left: {isAI ? (10 + push) + 'px' : 'auto'};
		margin-right: {isAI ? 'auto' : (10 + push) + 'px'};
		transform: rotate({rot}deg);"
>
	<div class="flex gap-2.5 items-start {isAI ? '' : 'flex-row-reverse'}">
		<!-- Avatar -->
		<div
			class="flex items-center justify-center flex-shrink-0 text-lg tracking-normal"
			style="width: 44px; height: 44px; background: #0b0b14; border: 2px solid {accent}; font-family: 'VT323', monospace; color: {accent}; box-shadow: 0 0 12px {isAI ? `rgba(${store.colors.cyanGlow},0.5)` : `rgba(${store.colors.magGlow},0.5)`}; clip-path: polygon(0 0,100% 0,100% 80%,80% 100%,0 100%);"
		>
			{isAI ? 'SYS' : 'USR'}
		</div>

		<!-- Content -->
		<div class="flex-1 min-w-0">
			<div
				class="mb-1 text-[15px] tracking-[2px]"
				style="font-family: 'VT323', monospace; color: {accent}; text-align: {isAI ? 'left' : 'right'};"
			>
				{isAI ? 'TERMINUS·7' : 'OPERATOR_K'}
				<span class="opacity-50 text-[9px] ml-1">{stamp}</span>
			</div>

			<div
				class="p-3 text-sm leading-relaxed tracking-[0.4px] whitespace-pre-wrap break-words"
				style="background: #0b0b14;
					border: 1px solid {accent};
					border-left: {isAI ? `4px solid ${accent}` : `1px solid ${accent}`};
					border-right: {isAI ? `1px solid ${accent}` : `4px solid ${accent}`};
					color: {store.colors.text};
					box-shadow: 4px 4px 0 rgba(0,0,0,0.6), inset 0 0 18px {isAI ? `rgba(${store.colors.cyanGlow},0.08)` : `rgba(${store.colors.magGlow},0.08)`};"
			>
				{msg.content}
			</div>

			{#if isAI}
				<div class="flex gap-1.5 mt-2">
					<button
						type="button"
						onclick={() => store.copyText(msg.content, msg.id)}
						disabled={!msg.content}
						class="cursor-pointer text-[10px] py-1 px-1.5 tracking-[1px] disabled:opacity-40"
						style="background: {store.copiedId === msg.id ? store.colors.cyan : '#07070c'}; color: {store.copiedId === msg.id ? '#07070c' : store.colors.cyan}; border: 1px solid rgba({store.colors.cyanGlow},0.5); font-family: 'Share Tech Mono', monospace;"
						onmouseenter={(e) => { if (store.copiedId !== msg.id) { e.currentTarget.style.background = store.colors.cyan; e.currentTarget.style.color = '#07070c'; } }}
						onmouseleave={(e) => { if (store.copiedId !== msg.id) { e.currentTarget.style.background = '#07070c'; e.currentTarget.style.color = store.colors.cyan; } }}
					>
						{store.copiedId === msg.id ? '▤ OK' : '▤ CPY'}
					</button>
					<button
						type="button"
						onclick={() => store.regenerate(msg.id)}
						disabled={store.generating || !msg.content}
						title="Regenerate this reply"
						class="cursor-pointer text-[10px] py-1 px-1.5 tracking-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
						style="background: #07070c; color: {store.colors.cyan}; border: 1px solid rgba({store.colors.cyanGlow},0.5); font-family: 'Share Tech Mono', monospace;"
						onmouseenter={(e) => { if (!store.generating) { e.currentTarget.style.background = store.colors.cyan; e.currentTarget.style.color = '#07070c'; } }}
						onmouseleave={(e) => { e.currentTarget.style.background = '#07070c'; e.currentTarget.style.color = store.colors.cyan; }}
					>
						↻ RGN
					</button>
					<button
						type="button"
						onclick={() => store.toggleFeedback(msg.id)}
						class="cursor-pointer text-[10px] py-1 px-1.5 tracking-[1px]"
						style="background: {store.feedback[msg.id] ? store.colors.mag : '#07070c'}; color: {store.feedback[msg.id] ? '#07070c' : store.colors.mag}; border: 1px solid {store.colors.mag}; font-family: 'Share Tech Mono', monospace;"
					>
						{store.feedback[msg.id] ? '◈ ACK' : '◈ FBK'}
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
