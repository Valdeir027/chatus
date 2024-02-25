const $chatMessages = Qs(".messages");


const setRoomActive = (room_id) =>{
    QsAll(".list-rooms li").forEach(el => {
        el.classList.remove("active");
        
    })

    Qs(`#room-${room_id}`).classList.add("active");
    Qs("#selected-room").value = room_id
};

const getMessages = async (room_id) => {

    const response = await fetch(`/${room_id}`);
    const html = await response.text();
    $chatMessages.innerHTML = html

    setRoomActive(room_id)
};



// const sendMessage = async (data) =>{

//     const response = await fetch(`/${data.room_id}/send`,{
//         method:"POST",
//         headers:{
//             "Content-type":"aplication/json",
//             "X-CSRFToken":data.csrfmiddlewaretoken
//         },
//         body: JSON.stringify(data)
//     });
//     const html = await response.text();
//     const $uniqueMessageContainer = Qs(".unique-message-container");
//     $uniqueMessageContainer.insertAdjacentHTML("beforeend", html);
 
//     Qs(".send-message").reset();
// };

const sendMessage =  async (data) => {
    const room_id = data.room_id
    const socket = new WebSocket(`ws://${window.location.host}/ws/chat/${room_id}/`);

    socket.onopen = function (event) {
        // Envie a mensagem assim que a conexão WebSocket estiver aberta
        socket.send(JSON.stringify({
            'message': data.message,
            'csrfmiddlewaretoken': data.csrfmiddlewaretoken
        }));
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        const $uniqueMessageContainer = Qs(".unique-message-container");
        $uniqueMessageContainer.insertAdjacentHTML("beforeend", data.message);
    };

    socket.onclose = function (event) {
        // Lógica para lidar com o fechamento da conexão, se necessário
    };

}
const createRoom = async (data) =>{

    const response = await fetch(`/create-room`,{
        method:"POST",
        headers:{
            "Content-type":"aplication/json",
            "X-CSRFToken":data.csrfmiddlewaretoken
        },
        body: JSON.stringify(data)
    });
    const html = await response.text();
    const $uniqueRoomContainer = Qs(".list-rooms");
    $uniqueRoomContainer.insertAdjacentHTML("afterbegin", html);
    const modal = bootstrap.Modal.getInstance(Qs(".modal"));
    modal.hide()
    getLastRoom()
    Qs(".create-room").reset();
    
}


const getLastRoom  =  () => {
    Qs(".list-rooms li").click();
}


Qs(".send-message").addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    sendMessage(data);
});


Qs(".send-message").addEventListener('submit', (e) =>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    sendMessage(data)
})


Qs(".create-room").addEventListener('submit', (e) =>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    createRoom(data)
})

