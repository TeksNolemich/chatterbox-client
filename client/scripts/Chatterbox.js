class Chatterbox {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com';
    this.friends = {};
  }

  init() {

  }

  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    let that = this;
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt&limit=500',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        data.results.forEach((message) => {
          that.renderMessage(message);
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
    return 'just fetched data..';
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderMessage({ username, text, roomname }) {

    let $messageContainer = $(`<div class="messageContainer"></div>`);
    let $userName = $(`<p class="username"></p>`);
    $userName.text(username);
    let $text = $(`<p class="text"></p>`);
    $text.text(text);
    $messageContainer.append($userName);
    $messageContainer.append($text);
    $('#chats').append($messageContainer);
  }

  renderRoom(roomName) {
    let $room = $(`<div>${roomName}</div>`);
    $('#roomSelect').append($room);
  }

  handleUsernameClick(userName) {
    this.friends[userName] = this.friends[userName] + 1 || 1;
  }

  handleSubmit(messageText) {
    let message = {
      username: 'Chris',
      text: messageText,
      roomname: 'hr101'
    };
    this.send(message);
    console.log(messageText);
  }
}