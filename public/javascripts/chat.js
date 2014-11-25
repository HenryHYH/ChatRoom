var socket = io();

socket.on('system message', function (msg) {
    $("#chat-list").append(template('system-message-item', {Message: msg}));
    ScrollChatListToBottom();
});

socket.on('message', function (info) {
    info.IsHost = (info.User.UId == $("#hfldUId").val());
    $("#chat-list").append(template('chat-item', info));
    ScrollChatListToBottom();
});

function ScrollChatListToBottom() {
    var ctrl = $("#chat-list-container");
    ctrl.animate({
        scrollTop: ctrl[0].scrollHeight
    }, "slow");
}

socket.on('new user', function (user) {
    $("#user-list").append(template('user-item', user));
});

socket.on('user info', function (user) {
    $("#hfldUId").val(user.UId);
    $("#cur-room").text(user.Room);
    $("#pop-box-container").hide();
});

socket.on('user list', function (list) {
    list.some(function (item) {
        if (item.UId == $("#hfldUId").val()) {
            item.IsHost = true;
            return true;
        }

        return false;
    });
    $("#user-list").html(template('user-items', {list: list}));
});

// 发送信息
function Send(msg) {
    socket.emit('message', msg);
}

// 开始聊天
function StartChat(info) {
    socket.emit('start chat', {
        Nickname: info.Nickname,
        Room: info.Room
    });
}

function Tip(msg) {
    $("#tip").text(msg).fadeIn('slow', 'linear').delay(1500).fadeOut('slow', 'linear');
}

$(function () {
    $("#chat-box").delegate("#btn-send", "click", function () {
        var txt = $("#chat-message"),
            msg = txt.val();

        if (!msg) {
            Tip('Please enter message');
            txt.focus();
            return false;
        }

        Send(msg);
        txt.val('').focus();

        return false;
    }).delegate("#chat-message", "keyup", function (e) {
        if (e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13)) {
            $("#btn-send").click();
        }
    });

    $("#pop-box").delegate("#btn-chat", "click", function () {
        var txtUserName = $("#user-name"),
            txtRoom = $("#room-name"),
            userName = txtUserName.val(),
            room = txtRoom.val();

        if (!userName) {
            Tip('Please enter your name');
            txtUserName.focus();
            return false;
        }
        else if (!room) {
            Tip('Please enter a room name');
            txtRoom.focus();
            return false;
        }

        StartChat({
            Nickname: userName,
            Room: room
        });
        txtUserName.val('');
        txtRoom.val('');

        $("#chat-message").focus();

        return false;
    }).delegate("#user-name", "keyup", function (e) {
        if (e.keyCode == 13) {
            $("#room-name").focus();
        }
    }).delegate("#room-name", "keyup", function (e) {
        if (e.keyCode == 13) {
            $("#btn-chat").click();
        }
    });

    $("#user-name").focus();
});

template.helper('formatHtml', function (str) {
    str = str.replace(/\n/g, '<br />'); // 替换回车回<br />

    return str;
});

template.helper('formatTime', function (str) {
    return str;
});