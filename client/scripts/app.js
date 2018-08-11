
let app = new Chatterbox();

app.fetch();
app.user = window.location.search.substring(10);

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
  // console.log(e);
  app.room = e.currentTarget.value;
  // console.log($(this));
  // console.log(app.room);
  // // console.log($(this).text());
  app.renderDisplay(app.room);
});

setInterval(function () {
  app.needsToBeRendered = true;
  app.fetch();
}, 20000);