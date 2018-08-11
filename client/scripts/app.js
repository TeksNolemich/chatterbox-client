// YOUR CODE HERE:
// http://parse.sfm8.hackreactor.com/

let app = new Chatterbox();

console.log(app.fetch());

// Event handlers
//onCLick of username
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
