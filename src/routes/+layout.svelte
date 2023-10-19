<script lang="ts">
	import 'modern-normalize/modern-normalize.css';
	import '../styles/main.scss';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: user = data.user;
</script>

<div id="main">
	<div id="content">
		<div id="main-content">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	#main {
		#content {
			#main-content {
				padding: 30px 15px 60px;
				@include breakpoint.up('md') {
					padding: 30px 30px 60px;
				}
			}
		}
	}
</style>
