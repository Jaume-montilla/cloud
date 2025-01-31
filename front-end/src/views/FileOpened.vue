<script setup>
	import { ref, onMounted, onBeforeMount} from 'vue';
	import { list, getFileInfo, updateFile } from '../services/ftp.js'

	const props = defineProps(['name'])
	const info = ref([])
	var infoOgValue = "";

	onBeforeMount(() => {
getFileInfo(props.name).then(x => {
	info.value.push(x['content'])
	infoOgValue =	info.value
		})
})

const save = () => {
if (info.value != infoOgValue) {
	infoOgValue = info.value
	updateFile(props.name, infoOgValue).then(x => {
		console.log(x)
	})
	console.log(info.value)
}
}
</script>

<template>
	<main>
		<h1> {{ props.name }}</h1>
		<a @click="$router.go(-1)"> &lt; Atras </a>
		<textarea v-if="info" v-model="info" rows="4" cols="50"> {{ info }} </textarea>
		<button @click="save">Save</button>
	</main>
</template>

<style scoped>
a{
	cursor: pointer;
}
textarea {
	width: 100%;
	height: 85vh;
	padding: 12px 20px;
	box-sizing: border-box;
	border: 2px solid #ccc;
	border-radius: 4px;
	background-color: #f8f8f8;
	font-size: 16px;
	resize: none;
}
</style>
