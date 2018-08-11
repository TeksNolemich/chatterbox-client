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
        that.fetch();
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
        limit: 1000,
        where: { text: { $exists: true } }
      },
      success: function (data) {
        data.results.forEach((message) => {
          let room = message.roomname;
          // console.log(message.objectId);
          if (that.messages.hasOwnProperty(room)) {
            that.messages[room].set(message.objectId, message);
          } else {
            that.messages[room] = new Map();
            that.messages[room].set(message.objectId, message);
          }
        });
        // TODO: get this variable somehow without pulling from global scope
        that.renderDisplay(room);
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
    $('#chats').prepend($messageContainer);
  }

  renderRoom(roomname, isChosen = false) {
    let $room = $(`<option class="room"></option>`);
    if (isChosen) {
      $room.prop('selected', true);
    }
    $room.val(roomname);
    $room.text(roomname);
    $('#roomSelect').append($room);
  }

  renderDisplay(room) {
    this.clearMessages();
    this.clearRooms();
    let messages = this.messages[room];
    messages.forEach(message => {
      console.log(message);
      this.renderMessage(message);
    });
    for (let key in this.messages) {
      let isChosen = (key === room);
      this.renderRoom(key, isChosen);
    }
  }

  handleUsernameClick(userName) {
    this.friends[userName] = this.friends[userName] + 1 || 1;
  }

  handleSubmit(messageText, room, user) {
    let message = {
      username: user,
      text: messageText,
      roomname: room
    };
    this.send(message);
    console.log(messageText);
  }
}