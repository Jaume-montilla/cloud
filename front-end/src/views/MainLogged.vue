<script setup>
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
			<div class="allFiles">
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

</style>
