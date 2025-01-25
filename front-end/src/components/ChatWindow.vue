<template>
 <div class="chat-window">
            <div class="chat-header">
                <!-- <img src="profile4.png" alt="Profile" class="profile-pic"> -->
                <span>Contact 4</span>
            </div>
            <div class="chat-messages">
                <div class="message received">Hi there!</div>
                <div class="message sent">Hello!</div>
                <div class="message received">How are you?</div>
            </div>
            <div class="chat-input">
                <button class="attach-button">+</button>
                <input type="text" placeholder="Type a message...">
                <button class="send-button">Send</button>
            </div>
        </div>
</template>

<style scoped>
.chat-window {
    width: 70%;
    display: flex;
    flex-direction: column;
    background-color: #e9e9e9;
}

.chat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    background-color: #ffffff;
    border-bottom: 1px solid #ccc;
    font-weight: bold;
}

.chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message {
    padding: 10px;
    border-radius: 10px;
    max-width: 60%;
}

.message.received {
    background-color: #ffffff;
    align-self: flex-start;
}

.message.sent {
    background-color: #dcf8c6;
    align-self: flex-end;
}

.chat-input {
    padding: 10px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid #ccc;
}

.chat-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.chat-input button {
    padding: 8px 15px;
    border: none;
    background-color: #007bff;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.chat-input button:hover {
    background-color: #0056b3;
}
</style>
