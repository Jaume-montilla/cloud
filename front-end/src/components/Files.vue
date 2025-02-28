<script setup>
import { ref } from 'vue'
import { deleteFile } from '../services/ftp.js'
import { defineEmits } from "vue";

const emit = defineEmits(["folder"]);
const props = defineProps(['fileNow', 'path'])

const fullPath = props.path ? `${props.path}/${props.fileNow}` : props.fileNow;
var fileExtension = props.fileNow.lastIndexOf('.') !== -1 ? props.fileNow.split('.').pop() : undefined;

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

let img = ref('');
var folder = false

switch (fileExtension) {
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
        folder = true;
        break;
    default:
        img.value = new URL('@/assets/other.svg', import.meta.url).href;
        break;
}

const delet = () => {
    if (confirm("Are you sure you want to delete the file?")) {
        deleteFile(fullPath, getCookie("username"), getCookie("port")); 
    }
}
</script>
<template>
  <article class="file">
    <button @click="delet" class="but_del">X</button>
    <div class="style_div_img" @click="$router.push({ name: 'file', params: { 'name': fullPath } })">
      <img :src="img" alt="File Icon" />
    </div>
    <h2>{{ props.fileNow }}</h2>
  </article>
</template>

<style scoped>
.style_div_img {
  margin: 0.6vw 0vw 0vw 0vw;
  height: auto;
}

img {
  width: 10vw;
  height: 5vw;
}

.file {
  display: grid;
  justify-items: start;
  box-shadow: 0 0 6px 2px #dcdcdc;
  /* outline: 1px solid black; */
  cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
  /* width: 10vw; */
  /* height: 13vw; */
  border-radius: 8px;
  margin-bottom: 0.5vw;
}

h2 {
  width: 10vw;
  height: 5vh;
  /* margin: 0vw 0vw 0vw 0vw; */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 1rem;
  margin: 0vw 0vw 1vw 0vw;
}

.but_del {
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(113, 113, 113, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.2vw;
  height: 1.2vw;
  font-size: 0.8em;
  border-radius: 0.4vw;
  cursor: pointer;
  /* outline: 1px solid rgba(113, 113, 113); */
  border: none;
}

.but_del:hover {
  color: rgba(255, 255, 255);
  background-color: rgba(113, 113, 113);
  outline: 1px solid rgb(67, 67, 67);
  transform: scale(1.1, 1.1);
  transition: 0.1s;
}
</style>
