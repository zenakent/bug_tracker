var socket = io();
// socket.on('socketToMe', function (data) {
//   console.log(data);
// });

socket.on('ticketUpdate', function (data) {
  console.log(data)
})