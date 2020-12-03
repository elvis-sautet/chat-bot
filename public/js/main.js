const chartForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomname = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//Join chatroom
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chartForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;

  //Emitting a message to the server
  socket.emit("chatMessage", msg);

  //Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to the DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>
    `;
  document.querySelector(".chat-messages").appendChild(div);
}

//Add roomname to dom
function outputRoomName(room) {
  roomname.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users
    .map(
      (user) =>
        `<li style="padding:0;text-transform: capitalize;">${user.username}</li>`
    )
    .join("")}
  `;
}
