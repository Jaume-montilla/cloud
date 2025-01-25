<template>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat App</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="chat-container">
        <!-- Sidebar with chat list -->
        <div class="chat-list">
            <div class="search-bar">
                <input type="text" placeholder="Search...">
            </div>
            <div class="chat-item">
                <!-- <img src="profile1.png" alt="Profile" class="profile-pic"> -->
                <span>Contact 1</span>
            </div>
            <div class="chat-item">
                <!-- <img src="profile2.png" alt="Profile" class="profile-pic"> -->
                <span>Contact 2</span>
            </div>
            <div class="chat-item">
                <!-- <img src="profile3.png" alt="Profile" class="profile-pic"> -->
                <span>Contact 3</span>
            </div>
            <div class="chat-item">
                <!-- <img src="profile4.png" alt="Profile" class="profile-pic"> -->
                <span>Contact 4</span>
            </div>
            <div class="chat-item">
                <!-- <img src="group1.png" alt="Group" class="profile-pic"> -->
                <span>Group 1</span>
            </div>
            <div class="chat-item">
                <!-- <img src="profile5.png" alt="Profile" class="profile-pic"> -->
                <span>Contact 5</span>
            </div>
        </div>

        <!-- <div class="chat-empty-state">
            <p>Selecciona una conversación para empezar a chatear</p>
        </div> -->

        <!-- Chat window -->
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
    </div>
</body>
</template>

<style scoped>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

.chat-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
}

.chat-list {
    width: 30%;
    background-color: #ffffff;
    border-right: 1px solid #ccc;
    display: flex;
    flex-direction: column;
}

.search-bar {
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.search-bar input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.chat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    transition: background-color 0.3s;
}

.chat-item:hover {
    background-color: #f7f7f7;
}

.profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ccc;
}

/* .chat-empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1; 
    font-size: 18px;
    color: #888; 
    text-align: center;
    background-color: #e9e9e9; 
}

.chat-content.hidden {
    display: none;
} */
</style>
