var hix = []
$(function () {
  var socket = io();
  $('form').submit(function () {
    var newMessage = $('#m').val();
    if (newMessage != '') {
      socket.emit('chat message', newMessage);
      $('#m').val('');
    }

    return false;
  });
  socket.on('chat message', function (msg) {
    hix.unshift(msg);
    if (hix.length > 10) {
      hix.splice(-1);
    }
    $('#messages').empty();
    for (let i = 0; i < hix.length; i++) {
      $('#messages').prepend($('<li>').text(hix[i]));
    }
  });
});

var app = {

  priceHistoryModule : {

    init: function () {
      console.log("Price History Loaded");
    }
  },

  pollModule : {

    init: function () {
      console.log("Poll Module loaded");
    }
  },

  newsModule : {

    init: function () {
      console.log("News module loaded");
    }
  },

  chatModule : {

    init: function () {
      console.log("chat module loaded");
    }
  },

  startup : function(){

    this.priceHistoryModule.init();
    this.pollModule.init();
    this.newsModule.init();
    this.chatModule.init();

  }

}

app.startup(); // main entry point of this application