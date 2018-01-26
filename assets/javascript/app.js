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

    socket : io(),

    chatHistory : [],

    init: function () {
      console.log("chat module loaded");

      $('form').submit(function () { // hook the chat form submit
        var newMessage = $('#m').val();

        if (newMessage != '') {
          app.chatModule.socket.emit('chat message', newMessage);
          $('#m').val('');
        }
    
        return false;
      });

      app.chatModule.socket.on('chat message', function (msg) {
        app.chatModule.chatHistory.unshift(msg);

        if (app.chatModule.chatHistory.length > 10) {
          app.chatModule.chatHistory.splice(-1);
        }

        $('#messages').empty();

        for (let i = 0; i < app.chatModule.chatHistory.length; i++) {
          $('#messages').prepend($('<li>').text(app.chatModule.chatHistory[i]));
        }

      });

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