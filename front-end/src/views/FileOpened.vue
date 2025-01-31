<script setup>
  import { ref, onMounted} from 'vue';
	import { list, getFileInfo } from '../services/ftp.js'

	const props = defineProps(['name'])

	const info = ref([])

	onMounted(async () => {
getFileInfo(props.name).then(x => {
	info.value.push(x['content'])
		})
})
</script>

<template>
  <main>
		<h1> {{ props.name }}</h1>
		<a @click="$router.go(-1)"> &lt; Atras </a>
		<p> {{ info }} </p>
		<textarea v-model="info" rows="4" cols="50"></textarea>
  </main>
</template>

<style scoped>
p{
	display: none;
}
a{
	cursor: pointer;
}
</style>
