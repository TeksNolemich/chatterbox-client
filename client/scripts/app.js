
let app = new Chatterbox();

app.fetch();
let userNombre = window.location.search.substring(10);
let room = 'hr101';

// Event handlers
$('body').on('click', '.username', function(e) {
  let userName = $(this).text();
  app.handleUsernameClick(userName);
});

$('#send').on('submit', function(e) {
  e.preventDefault();
  userNombre = window.location.search.substring(10);
  let inputMessage = e.currentTarget.children[0].value;
  app.handleSubmit(inputMessage, room, userNombre);
  e.currentTarget.children[0].value = '';
});


$('#roomSelect').change(function(e) {
  room = $(this).val();

  app.renderDisplay(room);
});


// setTimeout(function(){})