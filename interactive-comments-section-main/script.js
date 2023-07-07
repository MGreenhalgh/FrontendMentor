var data;
var currentUser;

async function fetchJSON() { //Load all the JSON data
    var r = await fetch('data.json');
    var d = await r.json();
    return data = d;
}

document.addEventListener('DOMContentLoaded', function () {
    populatePage() //Populating the page after waiting for the JSON data to load
});

async function populatePage() {
    var wait = await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything
    //Do stuff with fully loaded data
    if (data) console.log('JSON data loaded');
    loadCurrentUser();
    loadComments();
}

function loadComments() {
    for (var i = 0; i < data.comments.length; i++) {
        var commentsHolder = document.getElementById('comments');

        var commentAdd = constructComment(data.comments[i], constructButtons(data.comments[i].user.username, data.comments[i]), data.comments[i].user.username, false);
        if (data.comments[i].replies.length != 0) commentAdd += loadReplies(data.comments[i]);
        commentsHolder.innerHTML += commentAdd;
    }
}

function loadReplies(comment) {
    var repliesadd = "";

    for (var i = 0; i < comment.replies.length; i++) {
        repliesadd += constructComment(comment.replies[i], constructButtons(comment.replies[i].user.username, comment.replies[i]), comment.replies[i].user.username, true);
    }
    return repliesadd;
}

function constructButtons(username, comment) {
    var commentButtons;
    if (username == currentUser.username) {
        commentButtons = "<button type='button' class='deleteButton' onclick='startDelete(event, comment" + comment.id + ")'>Delete</button>" +
            "<button type='button' class='editButton' onclick='startEdit(event, comment" + comment.id + ")'>Edit</button>";
    }
    else {
        commentButtons = "<button type='button' class='replyButton' onclick='showReply(comment" + comment.id + ")'>Reply</button>";
    }
    return commentButtons;
}
function constructComment(comment, commentButtons, username, reply) {
    if (reply) reply = "reply"; else reply = "";
    if (username == currentUser.username) username = " you";
    var constructedComment =
        "<div class='commentBox " + reply + "' id='" + "comment" + comment.id + "'>" +
        "<div class='voteHolder'>" +
        "<button type='button' class='votePlus' onclick='voteScore(" + comment.id + ", event, \"plus\" )'></button>" +
        "<div class='voteScore'>" + comment.score + "</div>" +
        "<button type='button' class='voteMinus' onclick='voteScore(" + comment.id + ", event, \"minus\" )'></button>" +
        "</div>" +
        "<div class='commentBoxMain'>" +
        "<div class='commentBoxHeader'>" +
        "<img src='" + comment.user.image.png + "' alt='' class='commentUserImg'>" +
        "<span class='commentUserName" + username + "'>" + comment.user.username + "</span>" +
        "<span class='commentAge'>" + comment.createdAt + "</span>" +
        commentButtons +
        "</div>" +
        "<div class='commentText'>" + comment.content + "</div>" +
        "</div>" +
        "</div>" +//Start reply
        "<div id='comment" + comment.id + "ReplyBox" + "'class='replyBox reply hide'>" +
        "<img src='" + currentUser.image.png + "' class='replyUserImg'>" +
        "<textarea name='replyInput' class='replyInput' id='replyInputcomment" + comment.id + "' placeholder='Add a reply...'></textarea>" +
        "<button type='button' class='sendReplyButton' onclick='submitReply(event, comment" + comment.id + ")'>REPLY</button>" +
        "</div>";
    return constructedComment;
}

function loadCurrentUser() {
    currentUser = data.currentUser;
    document.getElementById('selfCommentUserImg').src = currentUser.image.png;
}

function voteScore(comment, event, vote) {
    var score;
    for (var i = 0; i < data.comments.length; i++) {
        if (data.comments[i].id == comment) { score = data.comments[i].score; }
        if (data.comments[i].replies.length != 0)
            for (var v = 0; v < data.comments[i].replies.length; v++) if (data.comments[i].replies[v].id == comment) { score = data.comments[i].replies[v].score; }
    }
    if (vote == "plus") {
        if (event.target.nextElementSibling.innerHTML == score + 1) {
            event.target.nextElementSibling.innerHTML = score;
            event.target.style.filter = "brightness(1)";
            return;
        }
        if (event.target.nextElementSibling.innerHTML == score || event.target.nextElementSibling.innerHTML == score - 1) {
            if (event.target.nextElementSibling.innerHTML == score) event.target.nextElementSibling.innerHTML = score + 1;
            else if (event.target.nextElementSibling.innerHTML == score - 1) {
                event.target.nextElementSibling.innerHTML = score + 1;
                event.target.nextElementSibling.nextElementSibling.style.filter = "brightness(1)";
            }
            event.target.style.filter = "brightness(0.7)";
        }
    }
    if (vote == "minus") {

        if (event.target.previousElementSibling.innerHTML == score - 1) {
            event.target.previousElementSibling.innerHTML = score;
            event.target.style.filter = "brightness(1)";
            return;
        }
        if (event.target.previousElementSibling.innerHTML == score || event.target.previousElementSibling.innerHTML == score + 1) {
            if (event.target.previousElementSibling.innerHTML == score) event.target.previousElementSibling.innerHTML = score - 1;
            else if (event.target.previousElementSibling.innerHTML == score + 1) {
                event.target.previousElementSibling.innerHTML = score - 1;
                event.target.previousElementSibling.previousElementSibling.style.filter = "brightness(1)";
            }
            event.target.style.filter = "brightness(0.7)";
        }
    }
}

function addSelfComment() {
    var comment = document.getElementById("selfCommentInput").value;
    if (comment) {
        console.log(comment);
        var highestCommentId = 0;
        for (var i = 0; i < data.comments.length; i++) {
            if (data.comments[i].id > highestCommentId) highestCommentId = data.comments[i].id;
            if (data.comments[i].replies.length != 0)
                for (var v = 0; v < data.comments[i].replies.length; v++) if (data.comments[i].replies[v].id > highestCommentId) highestCommentId = data.comments[i].replies[v].id
        }

        var newComment = {
            "id": highestCommentId + 1,
            "content": comment.toString(),
            "createdAt": "Now",
            "score": 0,
            "user": currentUser
        };

        document.getElementById('comments').innerHTML += constructComment(newComment, constructButtons(currentUser.username, newComment), currentUser.username, false);
        document.getElementById("selfCommentInput").value = "";

        if (document.getElementById(document.getElementById("selfCommentInput").id + "error")) {
            document.getElementById(document.getElementById("selfCommentInput").id + "error").remove();
            document.getElementById("selfCommentInput").style.borderColor = "#e0e0e0";
        }

    }
    else {
        var f = document.getElementById("selfCommentInput");
        if (!document.getElementById(f.id + "error")) {
            var e = document.createElement("div");
            e.innerText = "Cannot be empty";
            e.classList.add("error");
            e.style.margin = "80px 0 0 60px";
            e.style.display = "block";
            e.id = f.id + "error";
            f.parentElement.appendChild(e);
            f.style.borderColor = "red";
        }
    }

}

function showReply(comment) {
    const replyBox = document.getElementById(comment.id + "ReplyBox");
    if (replyBox.classList.contains("hide")) { replyBox.classList.remove("hide"); replyBox.style.width = comment.style.width }
    else replyBox.classList.add("hide");

}

function submitReply(event, comment) {
    var reply = document.getElementById('replyInput' + comment.id).value;
    if (reply) {
        var highestCommentId = 0;
        for (var i = 0; i < data.comments.length; i++) {
            if (data.comments[i].id > highestCommentId) highestCommentId = data.comments[i].id;
            if (data.comments[i].replies.length != 0)
                for (var v = 0; v < data.comments[i].replies.length; v++) if (data.comments[i].replies[v].id > highestCommentId) highestCommentId = data.comments[i].replies[v].id
        }

        var newReply = {
            "id": highestCommentId + 1,
            "content": reply.toString(),
            "createdAt": "Now",
            "score": 0,
            "user": currentUser
        };

        //MAKE A REPLY HAPPEN

        if (document.getElementById(document.getElementById('replyInput' + comment.id).id + "error")) {
            document.getElementById(document.getElementById('replyInput' + comment.id).id + "error").remove();
            document.getElementById('replyInput' + comment.id).style.borderColor = "#e0e0e0";
        }
        document.getElementById('replyInput' + comment.id).value = "";
        showReply(comment);
    }
    else {
        var f = document.getElementById('replyInput' + comment.id);
        if (!document.getElementById(f.id + "error")) {
            var e = document.createElement("div");
            e.innerText = "Cannot be empty";
            e.classList.add("error");
            e.style.margin = "80px 0 0 60px";
            e.style.display = "block";
            e.id = f.id + "error";
            f.parentElement.appendChild(e);
            f.style.borderColor = "red";
        }
    }
}