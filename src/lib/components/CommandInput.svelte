<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';
	import ModelPicker from './ModelPicker.svelte';

	let fileInput: HTMLInputElement;

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			store.send();
		}
	}

	function onAttachClick() {
		fileInput?.click();
	}

	async function onFilesSelected(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		if (input.files?.length) {
			await store.attachFiles(input.files);
			input.value = '';
		}
	}
</script>

<div class="flex-shrink-0 relative z-20" style="padding: {store.isMobile ? '64px 12px 8px' : '20px 24px 10px'};">
	<div
		class="relative"
		style="background: #0b0b14; border: 2px solid {store.colors.cyan}; box-shadow: 0 0 0 2px #07070c, 8px 8px 0 rgba({store.colors.magGlow},0.55), 0 0 26px rgba({store.colors.cyanGlow},0.35); clip-path: polygon(0 0,100% 0,100% 78%,97% 100%,3% 100%,0 82%);"
	>
		<!-- Header bar -->
		<div
			class="flex items-center justify-between px-3 py-1.5 border-b"
			style="background: linear-gradient(90deg, {store.colors.cyan}, #0b0b14); border-color: rgba({store.colors.cyanGlow},0.35);"
		>
			<div
				class="flex items-center gap-2 font-bold tracking-[2px]"
				style="font-family: 'VT323', monospace; font-size: 16px; color: #07070c;"
			>
				<span class="inline-block w-2 h-2 animate-tm-blink" style="background: #ff2b2b; box-shadow: 0 0 8px #ff2b2b;"></span>
				CMD_INPUT :: LIVE
			</div>
			<div
				class="tracking-[1px]"
				style="font-family: 'VT323', monospace; font-size: 15px; color: rgba(7,7,12,0.7);"
			>
				{store.clock}
			</div>
		</div>

		<!-- Input area -->
		<div class="flex items-end gap-2.5 p-3">
			<div class="flex-1 relative">
				<div
					class="absolute left-2.5 top-[11px] text-xl pointer-events-none"
					style="font-family: 'VT323', monospace; color: {store.colors.mag};"
				>
					&gt;_
				</div>
				<textarea
					bind:value={store.input}
					onkeydown={onKeyDown}
					placeholder="TRANSMIT DIRECTIVE TO NEURAL CORE..."
					rows="2"
					class="w-full resize-none outline-none py-2.5 pr-3 text-sm leading-relaxed tracking-[0.5px]"
					style="background: #07070c; color: {store.colors.text}; border: 1px solid rgba({store.colors.cyanGlow},0.4); padding-left: 34px; font-family: 'Share Tech Mono', monospace;"
					onfocus={(e) => { e.currentTarget.style.borderColor = store.colors.mag; e.currentTarget.style.boxShadow = `inset 0 0 12px rgba(${store.colors.magGlow},0.2)`; }}
					onblur={(e) => { e.currentTarget.style.borderColor = `rgba(${store.colors.cyanGlow},0.4)`; e.currentTarget.style.boxShadow = ''; }}
				></textarea>
				{#if store.attachHint}
					<div class="mt-1 text-[9px] tracking-[1px]" style="color: rgba({store.colors.magGlow},0.8); font-family: 'Share Tech Mono', monospace;">
						◈ {store.attachHint}
					</div>
				{/if}
			</div>

			<div class="flex flex-col gap-1.5 flex-shrink-0">
				<button
					type="button"
					onclick={() => store.send()}
					disabled={store.generating || !store.input.trim()}
					class="cursor-pointer border-0 py-2.5 px-4.5 transition-all duration-[80ms] tracking-[2px] disabled:cursor-not-allowed"
					style="font-family: 'VT323', monospace; font-size: 24px; color: #07070c; background: {store.colors.cyan}; box-shadow: 4px 4px 0 {store.colors.mag}; opacity: {store.generating || !store.input.trim() ? 0.5 : 1};"
					onmouseenter={(e) => { if (!store.generating && store.input.trim()) { e.currentTarget.style.background = store.colors.mag; e.currentTarget.style.boxShadow = `4px 4px 0 ${store.colors.cyan}`; } }}
					onmouseleave={(e) => { e.currentTarget.style.background = store.colors.cyan; e.currentTarget.style.boxShadow = `4px 4px 0 ${store.colors.mag}`; }}
					onmousedown={(e) => { if (!store.generating && store.input.trim()) { e.currentTarget.style.transform = 'translate(3px,3px)'; e.currentTarget.style.boxShadow = `1px 1px 0 ${store.colors.mag}`; } }}
					onmouseup={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `4px 4px 0 ${store.colors.mag}`; }}
				>
					SEND ▶
				</button>
				<div class="flex gap-1.5">
					<button
						type="button"
						onclick={onAttachClick}
						disabled={store.generating}
						title="Attach text files into the prompt buffer"
						class="flex-1 cursor-pointer text-[11px] py-1.5 px-2 tracking-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
						style="background: #0b0b14; color: {store.colors.cyan}; border: 1px solid {store.colors.cyan}; font-family: 'Share Tech Mono', monospace;"
						onmouseenter={(e) => { if (!store.generating) { e.currentTarget.style.background = store.colors.cyan; e.currentTarget.style.color = '#07070c'; } }}
						onmouseleave={(e) => { e.currentTarget.style.background = '#0b0b14'; e.currentTarget.style.color = store.colors.cyan; }}
					>
						⚟ ATT
					</button>
					<button
						type="button"
						onclick={() => store.stop()}
						disabled={!store.generating}
						title="Abort generation"
						class="flex-1 cursor-pointer text-[11px] py-1.5 px-2 tracking-[1px] disabled:cursor-not-allowed"
						style="background: #0b0b14; color: {store.generating ? store.colors.mag : 'rgba(185,247,255,0.4)'}; border: 1px solid {store.generating ? store.colors.mag : 'rgba(185,247,255,0.3)'}; font-family: 'Share Tech Mono', monospace; animation: {store.generating ? 'tm-pulse 1s steps(2) infinite' : 'none'};"
						onmouseenter={(e) => { if (store.generating) { e.currentTarget.style.background = store.colors.mag; e.currentTarget.style.color = '#07070c'; } }}
						onmouseleave={(e) => { if (store.generating) { e.currentTarget.style.background = '#0b0b14'; e.currentTarget.style.color = store.colors.mag; } }}
					>
						◼ STOP
					</button>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="flex items-center justify-between gap-2.5 px-2.5 py-2 border-t border-dashed" style="border-color: rgba({store.colors.cyanGlow},0.2);">
			<button
				type="button"
				onclick={() => (store.modelOpen = !store.modelOpen)}
				class="cursor-pointer bg-transparent text-[10px] tracking-[1px] py-[3px] px-2 whitespace-nowrap transition-all duration-100 max-w-[70%] overflow-hidden text-ellipsis"
				style="border: 1px dashed rgba({store.colors.cyanGlow},{store.modelOpen ? '0.7' : '0.35'}); font-family: 'Share Tech Mono', monospace; color: {store.modelOpen ? store.colors.cyan : 'rgba(185,247,255,0.6)'};"
				onmouseenter={(e) => { e.currentTarget.style.color = store.colors.cyan; e.currentTarget.style.borderColor = store.colors.cyan; }}
				onmouseleave={(e) => { e.currentTarget.style.color = store.modelOpen ? store.colors.cyan : 'rgba(185,247,255,0.6)'; e.currentTarget.style.borderColor = `rgba(${store.colors.cyanGlow},${store.modelOpen ? '0.7' : '0.35'})`; }}
			>
				◆ {store.currentModel}
				<span style="color: {store.colors.mag};">/{store.currentModelMeta.label}</span>
				▾
			</button>
			<span
				class="text-[9px] tracking-[2px] whitespace-nowrap overflow-hidden text-ellipsis"
				style="color: rgba(185,247,255,0.35);"
			>
				ENC:AES-256 ▚ LAT:11ms ▚ CORE_TEMP:{store.temp}°
			</span>
		</div>
	</div>

	<input
		bind:this={fileInput}
		type="file"
		class="hidden"
		multiple
		accept=".txt,.md,.json,.csv,.ts,.js,.svelte,.py,.rs,.go,.toml,.yml,.yaml,.log,text/*"
		onchange={onFilesSelected}
	/>

	<!-- Model picker dropdown -->
	{#if store.modelOpen}
		<ModelPicker />
	{/if}
</div>
