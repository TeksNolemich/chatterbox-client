class Chatterbox {
  constructor() {
    this.domain = 'http://parse.sfm8.hackreactor.com';
    this.resource = '/chatterbox/classes/messages';
    this.server = this.domain + this.resource;
    this.user = null;
    this.friends = {};
    this.messages = {};
    this.room = null;
    this.needsToBeRendered = true;
    this.initialized = false;
  }

  init() {
    this.fetch();
    this.user = window.location.search.substring(10);
    let that = this;
    setInterval(function () {
      that.needsToBeRendered = true;
      that.fetch();
    }, 20000);
  }

  send(message) {
    let that = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: that.server,
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
      url: that.server,
      type: 'GET',
      contentType: 'application/json',
      data: {
        limit: 1000,
        where: { 
          text: { $exists: true }
          // roomname: { $in: ['Pikachu'] }
       },
        order: '-createdAt'
      },
      success: function (data) {
        that.messages = {};
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
        if (!that.initialized) {
          let targetRoom = null;
          let targetRoomLength = 0;
          for (let key in that.messages) {
            if (that.messages[key].size > targetRoomLength) {
              targetRoom = key;
              targetRoomLength = that.messages[key].size;
            }
            that.room = targetRoom;
            that.initialized = true;
          }
        }
        if (that.needsToBeRendered) {
          console.log('needs to be rendered... current room is ', that.room)
          that.renderDisplay(that.room);
          that.needsToBeRendered = false;
        }
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
    username = username || 'null';
    text = text || 'null';
    roomname = roomname || 'null';
    let $messageContainer = $(`<div class="messageContainer"></div>`);

    let $userName = $(`<p class="username"></p>`);
    $userName.text(username.trim());
    if (this.friends.hasOwnProperty(username)) {
      $userName.addClass('friend');
    }

    let $text = $(`<p class="text"></p>`);
    $text.text(text.trim());

    let $timeStamp = $(`<p class="timeStamp"></p>`);
    $timeStamp.text(moment(createdAt).fromNow());

    $messageContainer.append($userName);
    $messageContainer.append($text);
    $messageContainer.append($timeStamp);
    $('#chats').append($messageContainer);
  }

  renderRoom(roomname, isChosen = false) {
    let $room = $(`<option class="room"></option>`);
    if (isChosen) {
      $room.prop('selected', true);
    }
    $room.text(roomname.trim());
    $('#roomSelect').append($room);
  }

  renderDisplay(room) {
    this.clearMessages();
    this.clearRooms();
    let messages = this.messages[room];
    if (messages) {
      messages.forEach(message => {
        this.renderMessage(message);
      });
    }
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
    this.needsToBeRendered = true;
  }
}