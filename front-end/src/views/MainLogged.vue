<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { list, getFileInfo, putFile} from '../services/ftp.js'
import File from '../components/Files.vue'

const files = ref([])
const currentFolder = ref('')  
const emit = defineEmits(['files-dropped'])
var path = ""

const loadFiles = async (folder) => {
  currentFolder.value = folder
  const response = await list(folder, name) 
  files.value = response.files
}

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
onBeforeMount(async () => {
	name = getCookie("username")
})

onMounted(async () => {
  await loadFiles()
})

const create = (fileName, fileContent) => {
  putFile(fileName, fileContent, name).then(() => {
    loadFiles(currentFolder.value)    })
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
	path += "/"+folderName
  loadFiles(folderName) }
</script>

<template>
  <div class="head">
    <img src="" alt="logo">
  </div>
  <main>
    <p class="grettering">Welcome back!</p>
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
          <button class="type" id="type"> &#11167; Tipo</button>
          <button class="people" id="people"> &#11167; Personas</button>
          <button class="modify" id="modify"> &#11167; Modificado</button>
          <button class="fuente" id="fuente"> &#11167; Fuente</button>
        </div>
      </div>
    </section>
    <section class="files">
      <p class="archivosSugeridos">Archivos Sugeridos</p>
      <div :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
        <p v-if="active">Drop your file here</p>
        <p v-if="!active">Drag your file here</p>
        <slot :dropZoneActive="active"></slot>
      </div>
      <div class="allFiles">
        <div v-for="file in files" :key="file">
          <File :fileNow="file" />
          <button @click="openFolder(file)">Abrir Carpeta</button>
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
