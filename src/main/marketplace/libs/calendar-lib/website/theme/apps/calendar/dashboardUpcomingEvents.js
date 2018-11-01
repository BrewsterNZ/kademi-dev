pageInitFunctions.push(function () {

    if($(".dashboard-upcomming-events").length > 0) {
        $("#event-range-form").on("change", "#upcomingEventDays", function() {
            flog("change days")
            $(this).parents("form").submit();
        });

        $("#event-range-form").forms({
            onSuccess: function () {
                Msg.info("Range set successfully");

                $("#dashboard-upcoming-events").reloadFragment({
                    whenComplete: function () {
                        $("abbr.timeago").timeago();
                    }
                });
            }
        })

        jQuery.timeago.settings.strings.inPast = "time has elapsed";
        jQuery.timeago.settings.allowFuture = true;
        $("abbr.timeago").timeago();
        $(".dashboard-upcoming-events").on("click", ".invite-accept", function (e) {
            e.preventDefault();
            if (confirm("Are you sure you would like to accept this invitation?")) {
                rsvp("ACCEPTED", $(e.target).closest("a").attr("href"));
            }
        });
        $(".dashboard-upcoming-events").on("click", ".invite-decline", function (e) {
            e.preventDefault();
            if (confirm("Are you sure you would like to decline this invitation?")) {
                rsvp("DECLINED", $(e.target).closest("a").attr("href"));
            }
        });
        function rsvp(partStat, href) {
            flog("rsvp", partStat, href);
            $.ajax({
                type: 'POST',
                url: href,
                dataType: "json",
                data: {
                    rsvp: partStat
                },
                success: function (data) {
                    Msg.info("Invitation RSVP processed ok");
                    $("#dashboard-upcoming-events").reloadFragment({
                        whenComplete: function () {
                            $("abbr.timeago").timeago();
                        }
                    });
                },
                error: function (resp) {
                    Msg.error("An error occured processing the event");
                }
            });
        }
    }

});