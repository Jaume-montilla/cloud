<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { list, getFileInfo, putFile } from '../services/ftp.js'
import File from '../components/Files.vue'

const files = ref([])
const currentFolder = ref('')  
const emit = defineEmits(['files-dropped'])
var name = ""
var port = ""
var path = ""

const loadFiles = async (folder = '') => {
  currentFolder.value = folder
  const response = await list(folder, name, port)
  files.value = response.files
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

onBeforeMount(async () => {
  name = getCookie("username")
  port = getCookie("port")
})

onMounted(async () => {
  await loadFiles()
})

const create = (fileName, fileContent = "File created!!") => {
  const filePath = path ? `${path}/${fileName}` : fileName
  putFile(filePath, fileContent, name, port).then(() => {
    loadFiles(currentFolder.value)
  })
}

let active = ref(false)

function setActive() {
  active.value = true
}

function setInactive() {
  active.value = false
}

function onDrop(e) {
  setInactive()
  const droppedFiles = e.dataTransfer.files

  if (droppedFiles.length > 0) {
    const file = droppedFiles[0]

    const reader = new FileReader()
    reader.onload = () => {
      const fileContent = reader.result
      create(file.name, fileContent)
    }
    reader.readAsText(file)
  }

  emit('files-dropped', [...droppedFiles])
}

const openFolder = (folderName) => {
  path = path ? `${path}/${folderName}` : folderName
  console.log(path)
  loadFiles(path)
}

const resetToRoot = () => {
  path = ""
  loadFiles()
}
</script>

<template>
  <div class="head">
    <img src="" alt="logo">
    <p @click="$router.push({ name: 'chat'})">Chats</p>
  </div>
  <main>
    <p class="greeting">Welcome back!</p>
    <section id="management">
      <div class="typedFilt">
        <div class="searchBox">
          <img src="../assets/menu.svg" alt="menu" class="menu">
          <input placeholder="Hinted search text" class="filter">
          <img src="../assets/lupa.svg" alt="lupa" class="lupa">
        </div>
      </div>
      <div class="filterCapsule">
        <div class="preMadeFiltres">
          <button class="type"> &#11167; Tipo</button>
          <button class="people"> &#11167; Personas</button>
          <button class="modify"> &#11167; Modificado</button>
          <button class="fuente"> &#11167; Fuente</button>
        </div>
      </div>
    </section>
    <section class="files">
      <p class="archivosSugeridos">Archivos Sugeridos</p>
      <button v-if="path" @click="resetToRoot">⬅ Back to Root</button>
      <div :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
        <p v-if="active">Drop your file here</p>
        <p v-if="!active">Drag your file here</p>
        <slot :dropZoneActive="active"></slot>
      </div>
      <div class="allFiles">
        <div v-for="file in files" :key="file">
          <File :fileNow="file" :path="path"  />
          <button v-if="file.lastIndexOf('.') === -1" @click="openFolder(file)">Abrir Carpeta</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style>

* {
	color: #000000;
}

body {
	background-color: #F5F5F5;
	margin-left: 0;
	margin-right: 0;
}

.head {
	background-color: #D9D9D9;
	height: 5em;
	width: 100vw;
	margin-left: 0px;
}

.grettering {
	text-align: center;
	font-size: 58px;
	font-weight: bold;
	margin-top: 2vh;
}

.preMadeFiltres > button {
	margin: 2vw 2vw; 
	width: 5vw;
	height: 2vw;
	background-color: #2C2C2C;
	color: white;
	border: 0px;
	border-radius: 10px;
}

.typedFilt {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2vw;
}

.filter {
	width: 46vw;
	height: 3vw;
	background-color: #ECE6F0;
	box-shadow: none;
	border: 0px;
	padding: 0 1vw;
}

.searchBox {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 50vw;
	background-color: #ECE6F0;
	border-radius: 50px;
	padding: 0 1vw; 
}

.filterCapsule {
	display: flex;
	width: 100vw;
	justify-content: center;
}

.filter:focus {
	outline: none;
}

.archivosSugeridos {
	margin-top: 2vw;
	margin-left: 3vw;
	font-size: 19px;
	font-weight: bold;
}

.allFiles {
	display: flex;
	gap: 2vw;
	margin-left: 3vw;
	margin-top: 4vh;
}
</style>
