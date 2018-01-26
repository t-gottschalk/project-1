var hix = []
$(function () {
    var socket = io();
    $('form').submit(function(){
      var newMessage = $('#m').val();
      if( newMessage != '' ){
        socket.emit('chat message', newMessage);
        $('#m').val('');
      }
      
      return false;
    });
    socket.on('chat message', function(msg){
      hix.unshift(msg);
      if(hix.length>10){hix.splice(-1);}
      $('#messages').empty();
      for(let i=0 ; i<hix.length ; i++){
          $('#messages').prepend($('<li>').text(hix[i]));
      }
    });
  });