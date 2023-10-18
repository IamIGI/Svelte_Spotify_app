<script lang="ts">
	import 'modern-normalize/modern-normalize.css';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';
	import { LogoutButton } from '$components'; //declare alias in svelte.config.ts file

	export let data: LayoutData;

	$: user = data.user;
</script>

{#if user}
	<p>{user.display_name}</p>
	<LogoutButton />
{/if}

<slot />
