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
        buildComment(data.comments[i]);
    }
}

function buildComment(comment) {
    var commentsHolder = document.getElementById('comments');

    var commentButtons;
    var you;

    if (comment.user.username == currentUser.username) {
        you = " you";
        commentButtons = "<button type='button' class='deleteButton'> <img src='images/icon-delete.svg' alt=''>Delete</button>" +
            "<button type='button' class='editButton'> <img src='images/icon-edit.svg' alt=''>Edit</button>";
    }
    else {
        commentButtons = "<button type='button' class='replyButton'> <img src='images/icon-reply.svg' alt=''>Reply</button>";
    }

    var commentAdd =
        "<div class='commentBox' id='" + "comment" + comment.id + "'>" +
        "<div class='voteHolder'>" +
        "<img class='votePlus' onclick='plusScore(" + comment.id + ", event)' src='images/icon-plus.svg'>" +
        "<div class='voteScore'>" + comment.score + "</div>" +
        "<img class='voteMinus'onclick='minusScore(" + comment.id + ", event)' src='images/icon-minus.svg'>" +
        "</div>" +
        "<div class='commentBoxMain'>" +
        "<div class='commentBoxHeader'>" +
        "<img src='" + comment.user.image.png + "' alt='' class='commentUserImg'>" +
        "<span class='commentUserName" + you + "'>" + comment.user.username + "</span>" +
        "<span class='commentAge'>" + comment.createdAt + "</span>" +
        commentButtons +
        "</div>" +
        "<div class='commentText'>" + comment.content + "</div>" +
        "</div>" +
        "</div>";

    if (comment.replies.length != 0) commentAdd += loadReplies(comment);

    commentsHolder.innerHTML += commentAdd;
}

function loadReplies(comment) {
    var repliesadd = "";

    var commentButtons;
    var you;

    for (var i = 0; i < comment.replies.length; i++) {

        if (comment.replies[i].user.username == currentUser.username) {
            you = " you";
            commentButtons = "<button type='button' class='deleteButton'> <img src='images/icon-delete.svg' alt=''>Delete</button>" +
                "<button type='button' class='editButton'> <img src='images/icon-edit.svg' alt=''>Edit</button>";
        }
        else {
            commentButtons = "<button type='button' class='replyButton'> <img src='images/icon-reply.svg' alt=''>Reply</button>";
        }

        repliesadd +=
            "<div class='commentBox reply' id='" + "comment" + comment.replies[i].id + "'>" +
            "<div class='voteHolder'>" +
            "<img class='votePlus' onclick='plusScore(" + comment.replies[i].id + ", event)' src='images/icon-plus.svg'>" +
            "<div class='voteScore'>" + comment.replies[i].score + "</div>" +
            "<img class='voteMinus'onclick='minusScore(" + comment.id + ", event)' src='images/icon-minus.svg'>" +
            "</div>" +
            "<div class='commentBoxMain'>" +
            "<div class='commentBoxHeader'>" +
            "<img src='" + comment.replies[i].user.image.png + "' alt='' class='commentUserImg'>" +
            "<span class='commentUserName" + you + "'>" + comment.replies[i].user.username + "</span>" +
            "<span class='commentAge'>" + comment.replies[i].createdAt + "</span>" +
            commentButtons +
            "</div>" +
            "<div class='commentText'>" + comment.replies[i].content + "</div>" +
            "</div>" +
            "</div>";
    }

    return repliesadd;

}

function loadCurrentUser() {
    currentUser = data.currentUser;
    document.getElementById('selfCommentUserImg').src = currentUser.image.png;
}

function plusScore(comment, event) {
    var c = Array.from(data.comments).find(check => check.id == comment);
    const score = c.score;
    if (event.target.nextElementSibling.innerHTML == score + 1) {
        event.target.nextElementSibling.innerHTML = score;
        event.target.style.filter = "brightness(1)";
    }
    if (event.target.nextElementSibling.innerHTML == score || event.target.nextElementSibling.innerHTML == score - 1) {
        if (event.target.nextElementSibling.innerHTML == score) event.target.nextElementSibling.innerHTML = score + 1;
        else if (event.target.nextElementSibling.innerHTML == score - 1) event.target.nextElementSibling.innerHTML = score + 1;
        event.target.style.filter = "brightness(0.7)";
    }
}

function minusScore(comment, event) {
    var c = Array.from(data.comments).find(check => check.id == comment);
    const score = c.score;
    if (event.target.previousElementSibling.innerHTML == c.score - 1) {
        event.target.previousElementSibling.innerHTML = score;
        event.target.style.filter = "brightness(1)";
    }
    if (event.target.previousElementSibling.innerHTML == score || event.target.previousElementSibling.innerHTML == score + 1) {
        if (event.target.previousElementSibling.innerHTML == score) event.target.previousElementSibling.innerHTML = score - 1;
        else if (event.target.previousElementSibling.innerHTML == score + 1) event.target.previousElementSibling.innerHTML = score - 1;
        event.target.style.filter = "brightness(0.7)";
    }
}