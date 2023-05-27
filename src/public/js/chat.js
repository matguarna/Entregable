//Este es el lado del cliente
console.log("Socket LOG");
//Para poder usar io() hay que importar la libreria en el html (chat.handlebars)
const socket = io();

let user;
let chatbox = document.getElementById("chatbox");

//Despues de instalar el CDN de sweetalert2 en chat.hbs
//Alerta y configuracion
Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresar el nombre de usuario",
  inputValidator: (value) => {
    return !value && "El nombre de usuario es obligatorio";
  },
  //Para no poder cliquear fuera de la ventana y cerrar el modal
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

//keyup: al levantar enter, se emite el mensaje
chatbox.addEventListener("keyup", (evento) => {
  if (evento.key == "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", {
        user,
        message: chatbox.value,
      });
      chatbox.value = "";
    }
  }
});

//Recibe el array de mensajes
socket.on("messageLogs", (data) => {
  const listaMensajes = document.getElementById("listaMensajes");
  let mensajes = "";
  data.forEach(({ user, message }) => {
    mensajes += `<li>${user} dice: ${message}</li>`;
  });
  listaMensajes.innerHTML = mensajes;
});

//Recibe la info del socket de auth para informar a los users
socket.on("newUserConnected", (user) => {
  if (!user) {
    return;
  } else {
    console.log(user);
    Swal.fire({
      text: `${user} ha ingresado al chat`,
      toast: true,
      position: "top-right",
      timer: 10000,
      title: "Nuevo usuario conectado: ",
      showConfirmButton: false,
      icon: "success",
    });
  }
});
