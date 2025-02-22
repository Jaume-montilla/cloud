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
    <button @click="$router.push({ name: 'chat' })">Chats</button>
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
      <div class="style_bar">
        <button class="button_type" id="type">
          <p>Tipo</p>
        </button>
        <button class="button_persons" id="people">
          <p>Personas</p>
        </button>
        <button class="button_modify" id="modify">
          <p>Modificacion</p>
        </button>
        <button class="button_font" id="fuente">
          <p>Fuente</p>
        </button>
      </div>
    </section>
    <section class="files">
      <button v-if="path" @click="resetToRoot" class="but_bckRoot">Back to Root</button>
      <div class="drop_drag" :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive"
        @dragleave.prevent="setInactive" @drop.prevent="onDrop">
				<div v-if="active">
					<p>Drop your file here</p>
					<img src="../assets/drop.svg" alt="" class="drag_drop">
				</div>
				<div v-if="!active">
        <p>Drag your file here </p>
					<img src="../assets/drag.svg" alt="" class="drag_drop">
				</div>
        <slot :dropZoneActive="active"></slot>
      </div>
      <p class="archivosSugeridos">Archivos Sugeridos</p>
      <div class="allFiles">
        <div class="style_div" v-for="file in files" :key="file">
          <File :fileNow="file" :path="path" />
          <button class="but_open_file" v-if="file.lastIndexOf('.') === -1" @click="openFolder(file)">Abrir
            Carpeta</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
body {
  background-color: rgba(0, 0, 0, 0);
  color: #000000;
	font-size: 16px;
  margin-left: 0;
  margin-right: 0;
}

.head {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: rgba(0, 123, 255, 0.5);
  height: 5em;
  width: auto;
  margin-left: 0px;
}
.drag_drop{
	width: 7.3vw;
  padding: 1vw;
  opacity: 0.35;
}


.head button {
  margin: 0vw 4vw 0vw 0vw;
  font-size: 1rem;
  border-radius: 0.3vw;
  cursor: pointer;
}

.greeting {
  text-align: center;
  font-size: 6rem;
  font-weight: bold;
  margin-top: 2vh;
}

/* .preMadeFiltres>button {
  margin: 2vw 2vw;
  width: 5vw;
  height: 2vw;
  background-color: #2C2C2C;
  color: white;
  border: 0px;
  border-radius: 10px;
} */

.typedFilt {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2vw;
}

.filter {
  width: 46vw;
  height: 3vw;
  background-color: rgba(0, 123, 255, 0);
  box-shadow: none;
  border: 0px;
  padding: 0 1vw;
}

.searchBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50vw;
  background-color: rgba(0, 123, 255, 0.3);
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
  display: flex;
  justify-content: center;
  margin: 2vw 0vw 2vw 3vw;
  /* margin-top: 2vw;
  margin-left: 3vw; */
  font-size: 2rem;
  font-weight: bold;
}

.drop_drag {
display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0px;
	border: 2px dotted;
  width: 38vw;
  height: 35vh;
  margin: 0 auto;
}

.drop_drag p {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0vw 0vw 0vw 0.3vw;
}

.icon_drag_file {
  width: 2vw;
  height: auto;
  margin: 0.3vw;
}

.allFiles {
  display: flex;
  gap: 2vw;
  margin-left: 3vw;
  margin-top: 4vh;
}

.but_bckRoot {
  margin: 0vw 0vw 1vw 3vw;
  align-items: end;
}

.style_div {
  justify-items: center;
}

.but_open_file {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
}

/* ESTILO BARRA DE BOTONES */
.style_bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1vw 1vw;
  margin: 1.2vw 0vw 0vw 0vw;
  /* outline: 1px solid #000;  */
}

.button_type {
  align-items: center;
  border: 0;
  border-radius: 0.3vw;
  /* background-color: #2c2c2c; */
  background-color: rgb(45, 97, 153);
  color: white;
  display: flex;
  flex-direction: row;
  margin: 0vw 5vw 0vw 0vw;
  padding: 0.6vw 1vw 0.6vw 1vw;
  cursor: pointer;
}

.button_persons {
  border: 0;
  background-color: rgb(45, 97, 153);
  color: rgb(255, 255, 255);
  margin: 0vw 5vw 0vw 0vw;
  padding: 0.6vw 0.8vw 0.6vw 0.8vw;
  border-radius: 0.3vw;
  cursor: pointer;
}

.button_modify {
  border: 0;
  background-color: rgb(45, 97, 153);
  color: white;
  border-radius: 0.3vw;
  margin: 0vw 5vw 0vw 0vw;
  padding: 0.6vw 0.8vw 0.6vw 0.8vw;
  cursor: pointer;
}

.button_font {
  border: 0;
  background-color: rgb(45, 97, 153);
  color: white;
  border-radius: 0.3vw;
  margin: 0vw 5vw 0vw 0vw;
  padding: 0.6vw 0.8vw 0.6vw 0.8vw;
  cursor: pointer;
}

.button_type:focus {
  background-color: rgba(0, 123, 255, 1);
  color: rgb(259, 259, 259);
  transform: scale(0.9, 0.9);
  transition: 0.1s;
}

.button_persons:focus {
  background-color: rgba(0, 123, 255, 1);
  color: rgb(259, 259, 259);
  transform: scale(0.9, 0.9);
  transition: 0.1s;
}

.button_modify:focus {
  background-color: rgba(0, 123, 255, 1);
  color: rgb(259, 259, 259);
  transform: scale(0.9, 0.9);
  transition: 0.1s;
}

.button_font:focus {
  background-color: rgba(0, 123, 255, 1);
  color: rgb(259, 259, 259);
  transform: scale(0.9, 0.9);
  transition: 0.1s;
}
</style>
