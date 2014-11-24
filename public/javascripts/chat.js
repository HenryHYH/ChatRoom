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
function StartChat(nickname) {
    socket.emit('start chat', nickname);
}

$(function () {
    $("#chat-box").delegate("#btn-send", "click", function () {
        var txt = $("#chat-message");
        Send(txt.val());
        txt.val('').focus();

        return false;
    });

    $("#pop-box").delegate("#btn-chat", "click", function () {
        var txt = $("#user-name");
        StartChat(txt.val());
        txt.val('');

        return false;
    });
});

template.helper('formatHtml', function (str) {
    str = str.replace(/\n/g, '<br />'); // 替换回车回<br />

    return str;
});