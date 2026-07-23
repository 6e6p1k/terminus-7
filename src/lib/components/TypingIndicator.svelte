<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';
</script>

<div
	class="self-start mt-4 ml-3.5 animate-tm-boot"
	style="max-width: 70%; transform: rotate(-0.6deg);"
>
	<div class="flex gap-2.5 items-start">
		<div
			class="flex items-center justify-center flex-shrink-0 text-[22px]"
			style="width: 44px; height: 44px; background: #0b0b14; border: 2px solid {store.colors.cyan}; font-family: 'VT323', monospace; color: {store.colors.cyan}; box-shadow: 0 0 12px rgba({store.colors.cyanGlow},0.5);"
		>
			◈
		</div>
		<div
			class="py-3.5 px-4.5"
			style="background: #0b0b14; border: 1px solid rgba({store.colors.cyanGlow},0.5); box-shadow: inset 0 0 16px rgba({store.colors.cyanGlow},0.12);"
		>
			<div class="flex items-center gap-3">
				<div class="flex gap-1 items-end h-5">
					<span class="w-1.5 h-5 animate-tm-load" style="background: {store.colors.cyan};"></span>
					<span class="w-1.5 h-5 animate-tm-load" style="background: {store.colors.cyan}; animation-delay: .15s;"></span>
					<span class="w-1.5 h-5 animate-tm-load" style="background: {store.colors.mag}; animation-delay: .3s;"></span>
					<span class="w-1.5 h-5 animate-tm-load" style="background: {store.colors.cyan}; animation-delay: .45s;"></span>
				</div>
				<span
					class="text-xl tracking-[2px]"
					style="font-family: 'VT323', monospace; color: {store.colors.cyan};"
				>
					PROCESSING<span class="inline-block w-2.5 h-4 ml-1 -mb-0.5 animate-tm-blink" style="background: {store.colors.mag};"></span>
				</span>
				<span class="text-[22px] animate-tm-pulse">⧗</span>
			</div>
		</div>
	</div>
</div>
