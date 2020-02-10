var socket = io();
// socket.on('socketToMe', function (data) {
//   console.log(data);
// });

socket.on('ticketUpdate', function (data) {
  console.log(data)
  let oldCount = $('#noticCount').text()
  let newCount = parseInt(oldCount) + 1
  $('#noticCount').text(newCount)
  $('#notifList').append(`<a class="dropdown-item d-flex align-items-center" href="${data.link}">
  <div class="mr-3">
    <div class="icon-circle bg-primary">
      <i class="fas fa-file-alt text-white"></i>
    </div>
  </div>
  <div>
    <span class="font-weight-bold">${data.message}</span>                
  </div>
</a>`)
})

socket.on('newTicket', function (data) {
  console.log(data)
  let oldCount = $('#noticCount').text()
  let newCount = parseInt(oldCount) + 1
  $('#noticCount').text(newCount)
  $('#notifList').append(`<a class="dropdown-item d-flex align-items-center" href="${data.link}">
  <div class="mr-3">
    <div class="icon-circle bg-primary">
      <i class="fas fa-file-alt text-white"></i>
    </div>
  </div>
  <div>
    <span class="font-weight-bold">${data.message}</span>                
  </div>
</a>`)
})

socket.on('newProject', function (data) {
  console.log(data)
  let oldCount = $('#noticCount').text()
  let newCount = parseInt(oldCount) + 1
  $('#noticCount').text(newCount)
  $('#notifList').append(`<a class="dropdown-item d-flex align-items-center" href="${data.link}">
  <div class="mr-3">
    <div class="icon-circle bg-primary">
      <i class="fas fa-file-alt text-white"></i>
    </div>
  </div>
  <div>
    <span class="font-weight-bold">${data.message}</span>                
  </div>
</a>`)
})