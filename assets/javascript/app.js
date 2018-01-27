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

    apiKey: apiKey,
    baseURL: "https://newsapi.org/v2/everything?q=", 

    topics: [
      "bitcoin",
      "ethereum",
      "ripple",
      "dogecoin"
    ],

    articles: {},

    init: function () {

      console.log("News module loaded");

      app.newsModule.topics.forEach(function(item) {

        app.newsModule.artGet(item);

      });

      console.log(app.newsModule.articles, "all topic results");

    },

    artGet: function(topic) {

      const queryURL = app.newsModule.baseURL + topic + "$from=2018-01-18&to=2018-01-25&sortBy=popularity&pageSize=10&apiKey=" + app.newsModule.apiKey;
      console.log(queryURL, "Query URL");

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(result) {

        const x = result.articles;

        Object.defineProperty(app.newsModule.articles, topic, {
          value: x
        });

      }).fail(function(err) {
        throw err;
      });

    },

    artDisplay: function() {

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