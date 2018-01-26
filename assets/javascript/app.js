var app = {

  userModule : {

    username : '',

    init: function(){
      $('#welcome-modal').modal('show'); // open the modal
      $('#welcome-modal').off('click'); // remove the background click event
      $('.modal-accept').on('click' , function(){

        var input = $('#nickname-input').val().trim();

        if( input != '' ){ // check if nickname is not empty
          app.userModule.username = input;
          $('#welcome-modal').modal('hide');
        }

      });
    }
  },

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

    this.userModule.init();
    this.priceHistoryModule.init();
    this.pollModule.init();
    this.newsModule.init();
    this.chatModule.init();

  }

}

app.startup(); // main entry point of this application