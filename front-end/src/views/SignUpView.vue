<script setup>
import { sign, logIn } from '@/services/register';
import { ref } from 'vue';

const user = ref({
    name: "",
    email: "",
    passwd: "",
    passwd2: "",
})

const saveInfo = (() => {
    console.log(user.value.name)
    sign(user.value.name, user.value.passwd, user.value.email).then((x) => {
        console.log(x)
    })
});
</script>

<template>
    <div class="divPrincipal">
        <div class="card_login">
            <h1 class="title_card">Register user</h1>
            <div class="card_elements_login">
                <input v-model="user.name" type="text" name="name_user" placeholder="Name user"
                    class="input_card_element" required>
                <input v-model="user.email" type="text" name="email" placeholder="E-mail" class="input_card_element"
                    required>
                <input v-model="user.passwd" type="password" name="passwd" placeholder="Password"
                    class="input_card_element" required>
                <input v-model="user.passwd2" type="password" name="repeat_passwd" placeholder="Repeat password"
                    class="input_card_element" required>
            </div>
            <div class="card_footer">
                <input @click="saveInfo" type="button" class="card_button_login" value="SIGN UP">
            </div>
            <p @click="$router.push({ name: 'login' })">already have an account?</p>
        </div>
    </div>
</template>

<style>
body {
    background-color: #F9FAFB;
}

p {
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
    height: 65vh;
    border-radius: 3vw;
    box-shadow: 1vw 1vw 6vw 2vw rgba(0, 123, 255, 0.165);
}

.card_elements_login {
    display: flex;
    flex-direction: column;
    width: 19vw;
}

.input_card_element {
    border: 0;
    border-bottom: 1px groove rgb(0, 0, 0);
    height: 4vh;
    margin: 1.5vw 0vw 0vw 0vw;
    font-size: 1.3rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #212121;
    background-color: transparent;
    transition: outline 0.2s ease-in-out;
}


.input_card_element:focus-visible {
    outline: none;
}

.input_card_element2 {
    border: 0;
    border-bottom: 1px groove rgb(0, 0, 0);
    height: 4vh;
    margin: 1vw 0vw 0vw 0vw;
    font-size: 1.3rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #212121;
    background-color: transparent;
}

/* 
.input_card_element3 {
    border: 0;
    border-bottom: 1px groove rgb(0, 0, 0);
    height: 4vh;
    margin: 1vw 0vw 1.5vw 0vw;
    font-size: 1.3rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #212121;
    background-color: transparent;
}

.input_card_element4 {
    border: 0;
    border-bottom: 1px groove rgb(0, 0, 0);
    height: 4vh;
    margin: 1vw 0vw 1.5vw 0vw;
    font-size: 1.3rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #212121;
    background-color: transparent;
} */

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

.p_login {
    font-style: italic;
}

.p_a_login {
    color: rgba(0, 123, 255, 0.5);
}

.card_footer {
    display: flex;
    flex-direction: column;
    margin: 1vw 0vw 0vw 0vw;
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

@media (max-width: 768px) {
    p {
        color: black;
        font-size: 0.7em;
    }

    .title_card {
        color: #212121;
        font-size: 0.8em;
    }

    .card_login {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-evenly;
        align-items: center;
        background-color: #F4F6F8;
        border: 0.1vw solid rgba(0, 123, 255, 0.165);
        width: 80vw;
        height: 38vh;
        border-radius: 3vw;
        box-shadow: 1vw 1vw 6vw 2vw rgba(0, 123, 255, 0.165);
    }

    .card_elements_login {
        display: flex;
        flex-direction: column;
        width: 68vw;
    }

    .input_card_element {
        border: 0;
        border-bottom: 1px groove rgb(0, 0, 0);
        height: 4vh;
        margin: 1.5vw 0vw 0vw 0vw;
        font-size: 0.7rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #212121;
        background-color: transparent;
        transition: outline 0.2s ease-in-out;
    }

    .rememb_login {
        display: flex;
        width: 70vw;
        margin: 0vw 0vw 0vw 0vw;
        justify-content: space-between;
    }

    .card_button_login {
        width: 18vw;
        height: 5vh;
        border-radius: 0.6vw;
        font-size: 0.6em;
        border: none;
        background-color: rgb(0, 123, 255);
        color: rgb(255, 255, 255);
        transition: outline 0.3s ease-in-out;
    }
}
</style>
