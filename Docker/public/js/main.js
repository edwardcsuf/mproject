$(function () {

    // test
    var socket = io();
    var chatter_count;
	var gusername;
	
    $.get('/get_chatters', function (response) {
        chatter_count = response.length; //update chatter count
		updateChatterText();
    });
	$.get('/get_dbstatus', function (response) {
		if (!response)
		{
			$("#join-chat").attr("disabled", true);
			$('#username').attr('placeholder', "Database is not connected, try refreshing in a bit");
		}
	});
	$('#username').keypress(function (e) {
		var key = e.which;
		if (key == 13)
		{
			$('#join-chat').click();
		}
	});	
    $('#join-chat').click(function () {
        var username = cleanInput($.trim($('#username').val()));
		if (username.length == 0)
		{
			$('#username').attr('placeholder', "Sorry, but you need to pick a username");
            $('#username').val('').focus();
		}
		else if (username.length > 15)
		{			
			$('#username').attr('placeholder', "Username is too long, 15 characters max");
            $('#username').val('').focus();
		}
		else
		{
			$.ajax({
				url: '/join',
				type: 'POST',
				data: {
					username: username
				},
				success: function (response) {
					if (response.status == 'OK') { //username doesn't already exists
						socket.emit('update_chatter_count', {
							'action': 'increase'
						});
						socket.emit('message', {
							'username': username,
							'message': "has joined the chat room!"
						});
						$('.chat').show();
						gusername = username;
						$('#leave-chat').data('username', username);
						$('#send-message').data('username', username);
						$.get('/get_messages', function (response) {
							if (response.length > 0) {
								var message_count = response.length;
								var html = '';
								for (var x = 0; x < message_count; x++) {
									html += "<div class='msg'><div class='user'>" + response[x]['sender'] + "</div><div class='txt'>" + response[x]['message'] + "</div></div>";
								}
								$('.messages').html(html);
							}
						});
						$('.join-chat').hide(); //hide the container for joining the chat room.
						$('#message').val('').focus();
					} else if (response.status == 'FAILED') { //username already exists
						alert("Sorry but the username already exists, please choose another one");
						$('#username').val('').focus();
					}
				}
			});
		}
    });
    $('#leave-chat').click(function () {
        var username = $(this).data('username');
        $.ajax({
            url: '/leave',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username
            },
            success: function (response) {
                if (response.status == 'OK') {
                    socket.emit('message', {
                        'username': username,
                        'message': " has left the chat room..."
                    });
                    socket.emit('update_chatter_count', {
                        'action': 'decrease'
                    });
                    $('.chat').hide();
                    $('.join-chat').show();
                    $('#username').val('');
					$('#username').attr('placeholder', "Enter a username to continue");                    
                }
            }
        });
    });
	
	$(window).on('beforeunload', function () {
		if ($('.chat').is(":visible")){
			socket.emit('message', {
							'username': gusername,
							'message': " has left the chat room..."
						});
			socket.emit('update_chatter_count', {
				'action': 'decrease'
			});
			$.ajax({
				url: '/leave',
				type: 'POST',
				dataType: 'json',
				data: {
					username: gusername
				}
			});
		}
    });
	$('#message').keypress(function (e) {
		var key = e.which;
		if (key == 13)
		{
			$('#send-message').click();
		}
	});		
    $('#send-message').click(function () {
        var username = $(this).data('username');
        var message = cleanInput($.trim($('#message').val()));
		if (message.length == 0)
		{
			$('#message').attr('placeholder', "Enter a message before sending");
            $('#message').val('').focus();
		}
		else if (message.length > 50)
		{
			$('#message').attr('placeholder', "Message is too long, 50 characters max");
            $('#message').val('').focus();
		}
		else
		{
			$('#message').attr('placeholder', "Enter your message...");
			$.ajax({
				url: '/send_message',
				type: 'POST',
				dataType: 'json',
				data: {
					'username': username,
					'message': message
				},
				success: function (response) {
					if (response.status == 'OK') {
						socket.emit('message', {
							'username': username,
							'message': message
						});
						$('#message').val('');
					}
				}
			});
		}
    });
	
	  // Prevents input from having injected markup
	const cleanInput = (input) => {
		return $('<div/>').text(input).html();
	}
	
	const updateChatterText = () => {
		if (chatter_count == 1)
		{	
			$('.chat-info').text("There is currently 1 user in the chat room");		
		}
		else
		{
			$('.chat-info').text("There are currently " + chatter_count + " users in the chat room");
		}
	}

    socket.on('send', function (data) {
        var username = data.username;
        var message = data.message;
        var html = "<div class='msg'><div class='user'>" + username + "</div><div class='txt'>" + message + "</div></div>";
        $('.messages').append(html);
		$('.messages')[0].scrollTop = $('.messages')[0].scrollHeight;
    });
    socket.on('count_chatters', function (data) {
        if (data.action == 'increase') {
            chatter_count++;
        } else {
            chatter_count--;
        }
		updateChatterText();
    });
});
