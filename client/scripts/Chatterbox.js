class Chatterbox {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com';
    this.friends = {};
    this.messages = {
      // '4chan': [ {user: Bob, text: Hello}]
    };
  }

  init() {
  }

  send(message) {
    let that = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        // that.fetch();
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
      url: `http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt`,
      type: 'GET',
      contentType: 'application/json',
      data: {
        limit:1000,
        where: { text : { $exists: true } }
      },
      success: function (data) {
        data.results.forEach((message) => {
          let room = message.roomname;
          that.messages[room] ? that.messages[room].push(message) : that.messages[room] = [message];
        });
        that.renderDisplay();
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

  clearRooms() {
    $('#roomSelect').empty();
  }

  renderMessage({ username, text, roomname, createdAt }) {
    let $messageContainer = $(`<div class="messageContainer"></div>`);

    let $userName = $(`<p class="username"></p>`);
    $userName.text(username);

    let $text = $(`<p class="text"></p>`);
    $text.text(text);

    let $timeStamp = $(`<p class="timeStamp"></p>`);
    $timeStamp.text(createdAt); 

    $messageContainer.append($userName);
    $messageContainer.append($text);
    $messageContainer.append($timeStamp);
    $('#chats').append($messageContainer);
  }

  renderRoom(roomname) {
    let $room = $(`<option class="room"></option>`);
    $room.val(roomname);
    $room.text(roomname);
    $('#roomSelect').append($room);
  }

  renderDisplay(room = '4chan') {
    this.clearMessages();
    this.clearRooms();
    let messages = this.messages[room];
    messages.forEach(message => {
      this.renderMessage(message);
    });
    for (let room in this.messages) {
      this.renderRoom(room);
    }
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