<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';

	function selectChat(id: string) {
		store.selectChat(id);
	}
</script>

{#snippet sidebarContent()}
	<div class="flex flex-col flex-1 w-full h-full">
		<!-- Header -->
		<div class="relative" style="padding: calc(18px + env(safe-area-inset-top, 0px)) 16px 14px; border-bottom: 1px solid rgba({store.colors.cyanGlow},0.28);">
			<div
				class="leading-[0.9] tracking-[1px]"
				style="font-family: 'VT323', monospace; font-size: 30px; color: {store.colors.cyan}; text-shadow: 0 0 10px rgba({store.colors.cyanGlow},0.55);"
			>
				TERMINUS<span style="color: {store.colors.mag};">·7</span>
			</div>
			<div class="mt-1.5 text-[10px] tracking-[3px]" style="color: rgba(185,247,255,0.5);">
				NEURAL // UPLINK v8.31
			</div>
		</div>

		<!-- Fold button -->
		{#if !store.isMobile}
			<button
				onclick={() => (store.collapsed = true)}
				class="w-full text-left cursor-pointer bg-transparent border-0 border-b border-dashed py-2.5 px-4 text-[11px] tracking-[2px] transition-colors duration-100"
				style="color: rgba(185,247,255,0.55); border-color: rgba({store.colors.cyanGlow},0.22); font-family: 'Share Tech Mono', monospace;"
				onmouseenter={(e) => (e.currentTarget.style.color = store.colors.cyan)}
				onmouseleave={(e) => (e.currentTarget.style.color = 'rgba(185,247,255,0.55)')}
			>
				«« FOLD_PANEL
			</button>
		{/if}

		<!-- New Chat button -->
		<div style="padding: 14px 14px 8px;">
			<button
				onclick={() => store.newChat()}
				class="w-full cursor-pointer text-left border-0 py-3 px-3.5 transition-all duration-[80ms]"
				style="font-family: 'VT323', monospace; font-size: 22px; letter-spacing: 1px; color: #07070c; background: {store.colors.cyan}; box-shadow: 5px 5px 0 {store.colors.mag}; clip-path: polygon(0 0,100% 0,100% 72%,94% 100%,0 100%);"
				onmouseenter={(e) => { e.currentTarget.style.background = store.colors.mag; e.currentTarget.style.boxShadow = `5px 5px 0 ${store.colors.cyan}`; e.currentTarget.style.transform = 'translate(-1px,-1px)'; }}
				onmouseleave={(e) => { e.currentTarget.style.background = store.colors.cyan; e.currentTarget.style.boxShadow = `5px 5px 0 ${store.colors.mag}`; e.currentTarget.style.transform = ''; }}
				onmousedown={(e) => { e.currentTarget.style.transform = 'translate(4px,4px)'; e.currentTarget.style.boxShadow = `1px 1px 0 ${store.colors.mag}`; }}
				onmouseup={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `5px 5px 0 ${store.colors.mag}`; }}
			>
				＋ NEW_CHAT.EXE
			</button>
		</div>

		<!-- Session log -->
		<div class="px-3.5 pt-1.5 pb-1 text-[10px] tracking-[3px]" style="color: rgba({store.colors.magGlow},0.7);">
			◤ SESSION_LOG
		</div>

		<!-- Chat list -->
		<div class="flex-1 overflow-y-auto px-2.5 py-1">
			{#each store.chats as chat (chat.id)}
				{@const active = chat.id === store.activeChatId}
				<button
					onclick={() => selectChat(chat.id)}
					class="block w-full text-left cursor-pointer p-2.5 mb-1.5 transition-colors duration-100"
					style="background: {active ? `rgba(${store.colors.cyanGlow},0.12)` : 'transparent'}; border: 1px solid {active ? store.colors.cyan : `rgba(${store.colors.cyanGlow},0.18)`}; color: {active ? store.colors.cyan : 'rgba(185,247,255,0.85)'}; box-shadow: {active ? `0 0 14px rgba(${store.colors.cyanGlow},0.3), inset 0 0 0 1px rgba(${store.colors.cyanGlow},0.4)` : 'none'};"
					onmouseenter={(e) => { if (!active) { e.currentTarget.style.animation = 'tm-glitch .28s steps(2) infinite'; e.currentTarget.style.borderColor = store.colors.mag; e.currentTarget.style.boxShadow = `0 0 14px rgba(${store.colors.magGlow},0.4), inset 0 0 0 1px rgba(${store.colors.magGlow},0.5)`; e.currentTarget.style.color = store.colors.mag; } }}
					onmouseleave={(e) => { if (!active) { e.currentTarget.style.animation = ''; e.currentTarget.style.borderColor = `rgba(${store.colors.cyanGlow},0.18)`; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.color = 'rgba(185,247,255,0.85)'; } }}
				>
					<div class="flex items-center gap-2">
						<span
							class="w-2 h-2 flex-shrink-0"
							style="background: {active ? store.colors.mag : `rgba(${store.colors.cyanGlow},0.5)`}; box-shadow: {active ? `0 0 8px ${store.colors.mag}` : 'none'};"
						></span>
						<span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm tracking-[0.5px]">{chat.title}</span>
					</div>
				</button>
			{/each}
		</div>

		<!-- User footer -->
		<div class="flex items-center gap-3 p-4 border-t" style="border-color: rgba({store.colors.cyanGlow},0.28); background: rgba({store.colors.cyanGlow},0.03);">
			<div
				class="flex items-center justify-center flex-shrink-0"
				style="width: 40px; height: 40px; background: #0b0b14; border: 2px solid {store.colors.mag}; font-family: 'VT323', monospace; font-size: 22px; color: {store.colors.mag}; box-shadow: 0 0 10px rgba({store.colors.magGlow},0.4);"
			>
				◕
			</div>
			<div class="flex-1 min-w-0">
				<div class="text-sm overflow-hidden text-ellipsis whitespace-nowrap tracking-[0.5px]" style="color: {store.colors.text};">
					OPERATOR_K
				</div>
				<div class="text-[10px] tracking-[2px]" style="color: {store.colors.cyan};">
					<span class="inline-block w-[7px] h-[7px] mr-[5px] animate-tm-pulse" style="background: {store.colors.cyan};"></span>
					ROOT ACCESS
				</div>
			</div>
			<button
				onclick={() => (store.settingsOpen = !store.settingsOpen)}
				class="cursor-pointer bg-transparent border-0 text-xl"
				style="font-family: 'VT323', monospace; color: rgba(185,247,255,0.5);"
				onmouseenter={(e) => (e.currentTarget.style.color = store.colors.cyan)}
				onmouseleave={(e) => (e.currentTarget.style.color = 'rgba(185,247,255,0.5)')}
			>
				⚙
			</button>
		</div>
	</div>
{/snippet}

{#if store.isMobile}
	{#if store.sidebarOpen}
		<button
			onclick={() => (store.sidebarOpen = false)}
			aria-label="Close sidebar"
			class="absolute inset-0 z-[70]"
			style="background: rgba(255,55,199,0.06);"
		></button>
	{/if}

	<aside
		class="absolute top-0 left-0 bottom-0 z-[80] flex flex-col transition-transform duration-200"
		style="width: 100%; max-width: 420px; background: rgba(9,9,16,0.95); backdrop-filter: blur(2px); border-right: 2px solid {store.colors.cyan}; transform: translateX({store.sidebarOpen ? '0' : '-102%'}); box-shadow: {store.sidebarOpen ? '12px 0 40px rgba(0,0,0,0.7)' : 'none'};"
	>
		{@render sidebarContent()}
	</aside>
{:else}
	<aside
		class="relative flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 z-10"
		style="width: {store.collapsed ? '64px' : '300px'}; background: #0b0b14; border-right: 2px solid {store.colors.cyan}; clip-path: polygon(0 0, 100% 0, 100% 96%, 92% 100%, 0 100%);"
	>
		{#if !store.collapsed}
			{@render sidebarContent()}
		{:else}
			<div class="flex flex-col items-center gap-4 w-full py-4">
				<button
					onclick={() => (store.collapsed = false)}
					class="flex items-center justify-center cursor-pointer"
					style="width: 42px; height: 42px; background: #0b0b14; border: 1px solid {store.colors.cyan}; color: {store.colors.cyan}; font-family: 'VT323', monospace; font-size: 22px; box-shadow: 2px 2px 0 rgba({store.colors.cyanGlow},0.35);"
				>
					▸
				</button>
				<button
					onclick={() => store.newChat()}
					class="flex items-center justify-center cursor-pointer"
					style="width: 42px; height: 42px; background: #0b0b14; border: 1px solid {store.colors.mag}; color: {store.colors.mag}; font-family: 'VT323', monospace; font-size: 22px; box-shadow: 2px 2px 0 rgba({store.colors.magGlow},0.4);"
				>
					＋
				</button>
				<div class="flex-1"></div>
				<div
					class="flex items-center justify-center flex-shrink-0"
					style="width: 40px; height: 40px; background: #0b0b14; border: 2px solid {store.colors.mag}; font-family: 'VT323', monospace; font-size: 22px; color: {store.colors.mag}; box-shadow: 0 0 10px rgba({store.colors.magGlow},0.4);"
				>
					◕
				</div>
			</div>
		{/if}
	</aside>
{/if}
