<script setup>
	import { ref, onMounted, onBeforeMount} from 'vue';
	import { getFileInfo, updateFile } from '../services/ftp.js'
	import { useRouter } from 'vue-router';  

	const router = useRouter();  
	const props = defineProps(['name'])
	const info = ref([])
	var infoOgValue = "";

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
var name = ""
var port = ""

	onBeforeMount(() => {
	name = getCookie("username")
	port = getCookie("port")
	getFileInfo(props.name, name, port).then(x => {
	info.value.push(x['content'])
	infoOgValue =	info.value
		})
})

const save = () => {
if (info.value != infoOgValue) {
	infoOgValue = info.value
	updateFile(props.name, infoOgValue, name, port).then(x => {
		console.log(x)
	})
	console.log(info.value)
}
}

document.body.addEventListener('keydown', (event) => {
    if(event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        save()
    }
});

document.body.addEventListener('keydown', (event) => {
    if(event.key === "ArrowLeft" && (event.metaKey || event.ctrlKey)) {
		console.log("click")
        router.push({ name: 'id'})
    }
});
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
h1{
	text-align: center;
}
a{
	font-size: 1rem;
	cursor: pointer;
	color: blue;
	transition: all 0.3;
}
a:hover{
	font-size: 1.1rem;
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
