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
    <p @click="delet">X</p>
    <div @click="$router.push({ name: 'file', params: {'name': fullPath} })">
      <img :src="img" alt="File Icon" />
      <h2>{{ props.fileNow }}</h2>
    </div>
  </article>
</template>

<style scoped>
img {
  height: 20vw;  
}

.file {
  border: 1px solid black;
  cursor: pointer;
}

h2 {
  text-align: center;
}
</style>
