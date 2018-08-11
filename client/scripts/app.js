
let app = new Chatterbox();
app.init();


// Event handlers
$('body').on('click', '.username', function (e) {
  let userName = $(this).text();
  app.handleUsernameClick(userName);
});

$('#send').on('submit', function (e) {
  e.preventDefault();
  userNombre = window.location.search.substring(10);
  let inputMessage = e.currentTarget.children[0].value;
  app.handleSubmit(inputMessage, app.room, app.user);
  e.currentTarget.children[0].value = '';
});

$('#roomSelect').change(function (e) {
  app.room = e.currentTarget.value;
  app.renderDisplay(app.room);
});

$('#newRoom').on('click', function(e) {
  let roomName = prompt('Enter Room Name...');
  let message = {
    username: 'Chatterbox Bot',
    text: `Room Created: "${roomName}"!`,
    roomname: roomName 
  };
  app.handleSubmit(message.text, message.roomname, message.username);
  app.room = roomName;
});

