<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';
	import ModelPicker from './ModelPicker.svelte';
	import type { SvelteEvent } from '$lib/types';

	const { colors, generating, clock, temp, currentModel, modelOpen, isMobile } = store;

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			store.send();
		}
	}
</script>

<div class="flex-shrink-0 relative z-20" style="padding: {isMobile ? '64px 12px 8px' : '20px 24px 10px'};">
	<div
		class="relative"
		style="background: #0b0b14; border: 2px solid {colors.cyan}; box-shadow: 0 0 0 2px #07070c, 8px 8px 0 rgba({colors.magGlow},0.55), 0 0 26px rgba({colors.cyanGlow},0.35); clip-path: polygon(0 0,100% 0,100% 78%,97% 100%,3% 100%,0 82%);"
	>
		<!-- Header bar -->
		<div
			class="flex items-center justify-between px-3 py-1.5 border-b"
			style="background: linear-gradient(90deg, {colors.cyan}, #0b0b14); border-color: rgba({colors.cyanGlow},0.35);"
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
				{clock}
			</div>
		</div>

		<!-- Input area -->
		<div class="flex items-end gap-2.5 p-3">
			<div class="flex-1 relative">
				<div
					class="absolute left-2.5 top-[11px] text-xl pointer-events-none"
					style="font-family: 'VT323', monospace; color: {colors.mag};"
				>
					&gt;_
				</div>
				<textarea
					bind:value={store.input}
					onkeydown={onKeyDown}
					placeholder="TRANSMIT DIRECTIVE TO NEURAL CORE..."
					rows="2"
					class="w-full resize-none outline-none py-2.5 pr-3 text-sm leading-relaxed tracking-[0.5px]"
					style="background: #07070c; color: {colors.text}; border: 1px solid rgba({colors.cyanGlow},0.4); padding-left: 34px; font-family: 'Share Tech Mono', monospace;"
					onfocus={(e) => { e.currentTarget.style.borderColor = colors.mag; e.currentTarget.style.boxShadow = `inset 0 0 12px rgba(${colors.magGlow},0.2)`; }}
					onblur={(e) => { e.currentTarget.style.borderColor = `rgba(${colors.cyanGlow},0.4)`; e.currentTarget.style.boxShadow = ''; }}
				></textarea>
			</div>

			<div class="flex flex-col gap-1.5 flex-shrink-0">
				<button
					onclick={() => store.send()}
					disabled={generating || !input.trim()}
					class="cursor-pointer border-0 py-2.5 px-4.5 transition-all duration-[80ms] tracking-[2px]"
					style="font-family: 'VT323', monospace; font-size: 24px; color: #07070c; background: {colors.cyan}; box-shadow: 4px 4px 0 {colors.mag}; opacity: {generating || !input.trim() ? 0.5 : 1};"
					onmouseenter={(e) => { if (!generating) { e.currentTarget.style.background = colors.mag; e.currentTarget.style.boxShadow = `4px 4px 0 ${colors.cyan}`; } }}
					onmouseleave={(e) => { if (!generating) { e.currentTarget.style.background = colors.cyan; e.currentTarget.style.boxShadow = `4px 4px 0 ${colors.mag}`; } }}
					onmousedown={(e) => { if (!generating) { e.currentTarget.style.transform = 'translate(3px,3px)'; e.currentTarget.style.boxShadow = `1px 1px 0 ${colors.mag}`; } }}
					onmouseup={(e) => { if (!generating) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `4px 4px 0 ${colors.mag}`; } }}
				>
					SEND ▶
				</button>
				<div class="flex gap-1.5">
					<button
						class="flex-1 cursor-pointer text-[11px] py-1.5 px-2 tracking-[1px]"
						style="background: #0b0b14; color: {colors.cyan}; border: 1px solid {colors.cyan}; font-family: 'Share Tech Mono', monospace;"
						onmouseenter={(e) => { e.currentTarget.style.background = colors.cyan; e.currentTarget.style.color = '#07070c'; }}
						onmouseleave={(e) => { e.currentTarget.style.background = '#0b0b14'; e.currentTarget.style.color = colors.cyan; }}
					>
						⚟ ATT
					</button>
					<button
						onclick={() => store.stop()}
						class="flex-1 cursor-pointer text-[11px] py-1.5 px-2 tracking-[1px]"
						style="background: #0b0b14; color: {generating ? colors.mag : 'rgba(185,247,255,0.4)'}; border: 1px solid {generating ? colors.mag : 'rgba(185,247,255,0.3)'}; font-family: 'Share Tech Mono', monospace; animation: {generating ? 'tm-pulse 1s steps(2) infinite' : 'none'};"
						onmouseenter={(e) => { if (generating) { e.currentTarget.style.background = colors.mag; e.currentTarget.style.color = '#07070c'; } }}
						onmouseleave={(e) => { if (generating) { e.currentTarget.style.background = '#0b0b14'; e.currentTarget.style.color = generating ? colors.mag : 'rgba(185,247,255,0.4)'; } }}
					>
						◼ STOP
					</button>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="flex items-center justify-between gap-2.5 px-2.5 py-2 border-t border-dashed" style="border-color: rgba({colors.cyanGlow},0.2);">
			<button
				onclick={() => (store.modelOpen = !store.modelOpen)}
				class="cursor-pointer bg-transparent text-[10px] tracking-[1px] py-[3px] px-2 whitespace-nowrap transition-all duration-100"
				style="border: 1px dashed rgba({colors.cyanGlow},{modelOpen ? '0.7' : '0.35'}); font-family: 'Share Tech Mono', monospace; color: {modelOpen ? colors.cyan : 'rgba(185,247,255,0.6)'};"
				onmouseenter={(e) => { e.currentTarget.style.color = colors.cyan; e.currentTarget.style.borderColor = colors.cyan; }}
				onmouseleave={(e) => { e.currentTarget.style.color = modelOpen ? colors.cyan : 'rgba(185,247,255,0.6)'; e.currentTarget.style.borderColor = `rgba(${colors.cyanGlow},${modelOpen ? '0.7' : '0.35'})`; }}
			>
				◆ {currentModel} ▾
			</button>
			<span
				class="text-[9px] tracking-[2px] whitespace-nowrap overflow-hidden text-ellipsis"
				style="color: rgba(185,247,255,0.35);"
			>
				ENC:AES-256 ▚ LAT:11ms ▚ CORE_TEMP:{temp}°
			</span>
		</div>
	</div>

	<!-- Model picker dropdown -->
	{#if modelOpen}
		<ModelPicker />
	{/if}
</div>
