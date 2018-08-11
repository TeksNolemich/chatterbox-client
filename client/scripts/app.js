
let app = new Chatterbox();

app.fetch();

// Event handlers
//onClick of username
$('body').on('click', '.username', function(e) {
  let userName = $(this).text();
  app.handleUsernameClick(userName);
});

$('#send').on('submit', function(e) {
  e.preventDefault();
  let inputMessage = e.currentTarget.children[0].value;
  app.handleSubmit(inputMessage);
  e.currentTarget.children[0].value = '';
});


$('#roomSelect').change(function(e) {
  let room = $(this).val();
  app.renderDisplay(room);
});
