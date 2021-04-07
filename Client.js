const socket = io("http://localhost:8000");

//Get DOM elements in respective Js variables.
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages.
var audio = new Audio("ting.mp3");

//Function which will append event info to the container.
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);

  messageContainer.append(messageElement);

  if (position == "left") {
    audio.play();
  }
};

//Ask new user his/her name and let the server know it.
const names = prompt("Enter your name to join the chat");
socket.emit("new-user-joined", names);

//If a new user joins, receives his/her name from the server.
socket.on("user-joined", (names) => {
  append(`${names} joined the chat`, "right");
});

//If the  server sends the message , receive it.
socket.on("receive", (data) => {
  append(`${data.name}:${data.message}`, "left");
});

//If the user leaves the chat, append the info to the container.
socket.on("leave", (names) => {
  append(`${names} left the chat`, "right");
});

//If the form get submitted , send the message to server.
form.addEventListener("submit", (e) => {
  e.preventDefault(); //This is will prevent page from reloading while sending message.
  const message = messageInput.value;
  append(`You:${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
