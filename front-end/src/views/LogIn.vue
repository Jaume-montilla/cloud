<script setup>
import { logIn, sign } from "../services/register.js"
import { ref } from 'vue';
import { useRouter } from 'vue-router';  
import { log } from '../services/ftp.js'
const router = useRouter();  

const user = ref({
    name: "",
    passwd: "",
})


const check = (() => {
    console.log(user.value.name)
    logIn(user.value.name, user.value.passwd).then((x) => {
        console.log(x.message)
				if (x.message === "Conexión FTP exitosa") {
				document.cookie
				document.cookie = "username="+user.value.name+"; expires=Thu, 18 Dec 2026 12:00:00 UTC";
					log(user.value.name).then((x) => {
						console.log(x)
					})
					router.push({ name: 'id'})
				}
    })

})


</script>

<template>
    <div class="divPrincipal">
        <div class="card_login">
            <h1 class="title_card">Log In</h1>
            <div class="card_elements_login">
                <input v-model="user.name" type="text" value="" placeholder="User id" class="input_card_element1">
                <input v-model="user.passwd" type="text" value="" placeholder="Password" class="input_card_element2">
            </div>
            <div class="rememb_login">
                <div class="remlab_login">
                    <input type="checkbox" id="remember" class="rememberMe_login">
                    <label for="remember" class="colorLabel">Remember me</label>
                </div>
                <p class="p_login"><a class="p_a_login">Forgot password?</a></p>
            </div>
            <div class="card_footer">
                <input @click="check" type="button" class="card_button_login" value="LOGIN">
								<p @click="$router.push({ name: 'signup'})">create your account</p>
            </div>
        </div>
    </div>
</template>
<style>
body {
    background-color: #F9FAFB;
}

p{
	color: black;
}

.title_card {
    color: #212121;
}

.divPrincipal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 87vh;
}

.card_login {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: center;
    background-color: #F4F6F8;
    border: 0.1vw solid rgba(0, 123, 255, 0.165);
    width: 26vw;
    height: 40vh;
    border-radius: 3vw;
    box-shadow: 1vw 1vw 6vw 2vw rgba(0, 123, 255, 0.165);
}

.card_elements_login {
    display: flex;
    flex-direction: column;
    width: 19vw;
}

.input_card_element1 {
    border: 0;
    border-bottom: 1px groove rgb(0, 0, 0);
    height: 4vh;
    margin: 0vw 0vw 0vw 0vw;
    font-size: 1.3rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #212121;
    background-color: transparent;
    transition: outline 0.2s ease-in-out;
}


.input_card_element1:focus-visible {
    outline: none;
}


.input_card_element2:focus-visible {
    outline: none;
}

.input_card_element2 {
    border: 0;
    border-bottom: 1px groove rgb(0, 0, 0);
    height: 4vh;
    margin: 1.4vw 0vw 0vw 0vw;
    font-size: 1.3rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #212121;
    background-color: transparent;
}

.rememb_login {
    display: flex;
    width: 19vw;
    /* margin: 0vw 0vw 0vw 0vw; */
    justify-content: space-between;
}

.remlab_login {
    display: inline;
}

.colorLabel {
    cursor: pointer;
    display: flex;
    position: relative;
    cursor: pointer;
    color: #212121;
}

.colorLabel:before {
    content: '';
    display: flex;
    width: 1rem;
    height: 1rem;
    margin-right: .5rem;
    border: 2px solid #000;
}

/* on check */
.rememberMe_login:checked+.colorLabel:before {
    background-color: rgb(0, 123, 255);
}

.rememberMe_login {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px);
    /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
    opacity: 0;
}

.rememberMe_login:checked+.colorLabel:after {
    content: '';
    position: absolute;
    top: .3rem;
    left: .25rem;
    width: .6rem;
    height: .3rem;
    border: 2px solid #ffffff;
    border-top: 0;
    border-right: 0;
    transform: rotate(-45deg);
}

.p_login {
    font-style: italic;
}

.p_a_login {
    color: rgba(0, 123, 255, 0.5);
}

.card_button_login {
    width: 12vw;
    height: 5vh;
    border-radius: 0.6vw;
    border: none;
    background-color: rgb(0, 123, 255);
    color: rgb(255, 255, 255);
    transition: outline 0.3s ease-in-out;
}

.card_button_login:hover {
    background-color: #0056B3;

}
</style>
