const socket = io('http://localhost:8000');

const form = document.getElementById('send');
const messageInput = document.getElementById('messageInp');
const messageBox = document.getElementById("messageBox");
const onlineUsers = document.getElementById("onlineUsers");

function createLeftMessage(message){
    const div = document.createElement('div');
    div.innerHTML = `<div class="d-flex"><div class="border rounded-lg p-2 my-1 bg-light" style="width: 40%;">${message}</div></div>`
    return (div.firstElementChild);
}

function createRightMessage(message){
    const div = document.createElement('div');
    div.innerHTML = `<div class="d-flex justify-content-end"><div class="border rounded-lg p-2 my-1 bg-light" style="width: 40%;">${message}</div></div>`
    return (div.firstElementChild);
}

function createCenterMessage(message){
    const div = document.createElement('div');
    div.innerHTML = `<div class="d-flex justify-content-center"><div class="text-center text-white p-2 my-1" style="width: 40%;">${message}</div></div>`
    return (div.firstElementChild);
}

function addUser(userName, id){
    const div = document.createElement('div');
    div.innerHTML = `<h5 class="row m-2 mb-3 px-2" id=${id}>${userName}</h5>`;
    onlineUsers.append(div.firstElementChild);
}

function deleteUser(id){
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

const append = (message, position) =>{
    if(position == 'left'){
        elem = createLeftMessage(message)
    }else if(position == 'right'){
        elem = createRightMessage(message)
    }else{
       elem = createCenterMessage(message)
    }
    messageBox.append(elem)
    elem.scrollIntoView();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ""
})

const userName = prompt("Enter your name");

socket.emit('new-user-joined', userName);

socket.on('joined', data =>{
    addUser("You", data.myId);
    for(let [key, value] of Object.entries(data.users)){
        addUser(value.userName, value.id);
    }
});

socket.on('user-joined', data =>{
    addUser(data.userName, data.id);
    append(`${data.userName} joined the chat`, 'center');
});

socket.on('receive', data =>{
    append(`${data.userName}: ${data.message}`, 'left');
});

socket.on('left', data => {
    console.log(data);
    deleteUser(data.id);
    append(`${data.userName} left the chat`, 'center')
});
