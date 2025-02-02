<script setup>
	import { ref, onMounted } from 'vue'
	import { list, getFileInfo, putFile } from '../services/ftp.js'
	import File from '../components/Files.vue'

	const files = ref([])
	const emit = defineEmits(['files-dropped'])

	onMounted(async () => {
		list().then((x) => {
			x.files.forEach(element => {
				files.value.push(element)
			});
		});
	})

	const create = (fileName, fileContent) => {
		// Crea el archivo con el nombre y el contenido del archivo que arrastras
		putFile(fileName, fileContent)
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
		console.log(droppedFiles)

		if (droppedFiles.length > 0) {
			const file = droppedFiles[0]

			// Lee el contenido del archivo usando FileReader
			const reader = new FileReader()
			reader.onload = () => {
				// Una vez que el archivo se ha leído, obtenemos su contenido
				const fileContent = reader.result
				create(file.name, fileContent) // Crea el archivo en el servidor
			}
			reader.readAsText(file) // Lee el archivo como texto
		}

		emit('files-dropped', [...droppedFiles])
	}

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
					<button class="type" id="type"> &#11167;	Tipo</button>
					<button class="people" id="people"> &#11167;	Personas</button>
					<button class="modify" id="modify"> &#11167;	Modificado</button>
					<button class="fuente" id="fuente"> &#11167;	Fuente</button>
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
				<button @click="create">Create File</button>
				<File v-for="file in files" :key="file" :fileNow="file" />
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
