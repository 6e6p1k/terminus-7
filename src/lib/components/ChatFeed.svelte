<script lang="ts">
	import { store } from '$lib/stores/chat.svelte';
	import MessageBubble from './MessageBubble.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
</script>

<div
	class="flex-1 overflow-y-auto relative"
	style="padding: {store.isMobile ? '6px 8px' : '6px 20px'};"
>
	<div class="max-w-[960px] mx-auto flex flex-col py-2 pb-10">
		{#each store.messages as msg, i (msg.id)}
			<MessageBubble {msg} {i} />
		{/each}

		{#if store.generating}
			<TypingIndicator />
		{/if}
	</div>
</div>
