<script setup>
 import { ref } from 'vue'
import { deleteFile } from '../services/ftp.js'
const props = defineProps(['fileNow'])
var n = props.fileNow.split('.')[1];
console.log(n)
let img = ref('');
switch (n) {
    case "rs":
        img.value = new URL('@/assets/rust.svg', import.meta.url).href;
        break;
    case "docx":
    case "txt":
        img.value = new URL('@/assets/word.svg', import.meta.url).href;
        break;
    case "xls":
    case "calc":
        img.value = new URL('@/assets/excel.svg', import.meta.url).href;
        break;
    case "sh":
    case "cmd":
    case "lua":
    case "cpp":
    case "json":
    case "js":
    case "html":
    case "css":
    case "c":
    case "vue":
        img.value = new URL('@/assets/programing.svg', import.meta.url).href;
        break;
		case undefined:
        img.value = new URL('@/assets/folder.svg', import.meta.url).href;
        break;		
    default:
        img.value = new URL('@/assets/other.svg', import.meta.url).href;
        break;
	}

	const delet= () =>{
		 if (confirm("Are you sure you wan to delete the file!")){
		deleteFile(props.fileNow)}
	}
</script>

<template>
  <article class="file" >
	<p @click="delet">X</p>
    <div @click="$router.push({ name: 'file', params: {'name': props.fileNow} })">
      <img :src="img" alt="" />
      <h2>{{ props.fileNow }}</h2>
    </div>
  </article>
</template>

<style scoped>
img{
	height: 20vw;	
}

.file {
  border: 1px solid black;
	cursor: pointer;
}

h2{
	text-align: center;
}
</style>

