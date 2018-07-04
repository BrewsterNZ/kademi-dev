$(function () {
    flog("init wall.js");

    $("body").on("click", ".btn-vote-up", function (e) {
        e.preventDefault();
        var target = $(e.target);
        var postContainer = target.closest(".post-item");
        flog("post container", postContainer, target);
        var id = postContainer.data("post-id");
        upvote(id, postContainer);
    });

    $("body").on("click", ".btn-post-reply", function (e) {
        e.preventDefault();
        var target = $(e.target);
        var postContainer = target.closest(".post-item");
        var text = postContainer.find(".post-reply").val();
        flog("post reply", postContainer, target);
        var id = postContainer.data("post-id");
        postReply(id, text, postContainer);
    });

    $(".forum-post-form").forms({
        onSuccess: function (resp, form) {
            if( resp.status){
                Msg.success("Posted");
                var modal = form.closest(".modal");
                form.find("textarea").val("");
                modal.modal("hide");
            } else {
                Msg.warning("Sorry, there was an error posting your message " + resp.messages);
            }
        }
    });
});

function postReply(id, text, postContainer) {
    flog("postReply", id, text);
    $.ajax({
        url: '/kforums',
        type: 'POST',
        dataType: 'JSON',
        data: {
            replyToPostId : id,
            replyText : text
        },
        success: function (resp) {
            if (resp.status) {
                flog("done");
            } else {
                Msg.warning(resp.messages);
            }
        },
        error: function () {
            Msg.error('Sorry, couldnt post your reply');
        }
    });
}

function upvote(id, postContainer) {
    flog("upvote", id);
    $.ajax({
        url: '/kforums',
        type: 'POST',
        dataType: 'JSON',
        data: {
            voteId : id,
            isUp : true
        },
        success: function (resp) {
            if (resp.status) {
                flog("done");
            } else {
                Msg.warning(resp.messages);
            }
        },
        error: function () {
            Msg.error('Sorry, couldnt send your vote');
        }
    });
}