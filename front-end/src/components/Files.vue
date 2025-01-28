<script setup>
	const props = defineProps(['fileNow'])
	console.log(props)
</script>

<template>
	<article class="file">
		<div>
			<h2> {{ props.fileNow }} </h2>
		</div>
	</article>
</template>

<style scoped>
.file{
}
</style>
