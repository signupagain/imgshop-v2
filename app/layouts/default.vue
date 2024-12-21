<template>
	<v-app>
		<div class="ma-auto" style="width: min(100%, 1800px)">
			<NavBanner />
			<v-main class="h-full">
				<slot />
			</v-main>
		</div>
	</v-app>
</template>
