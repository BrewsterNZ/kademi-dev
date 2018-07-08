/* global controllerMappings, views, transactionManager, applications, Utils */

(function (g) {

    controllerMappings
            .adminController()
            .path('/recognition')
            .addMethod('GET', 'checkRedirect')
            .enabled(true)
            .build();

    controllerMappings
            .adminController()
            .path('/recognition/')
            .defaultView(views.templateView('/theme/apps/KRecognition/manageTopics.html'))
            .addMethod('GET', '_getTopicsAsJson', 'asJson')
            .addMethod('POST', '_createTopic', 'newName')
            .addMethod('POST', '_deleteAward', 'deleteAward')
            .postPriviledge('WRITE_CONTENT')
            .enabled(true)
            .build();

    controllerMappings.addEventListener('RecognitionEvent', true, "_onRecognitionAwarded");

    controllerMappings.addComponent("KRecognition/components",
        "levelPanel", "html", "Displays the current level for a topic", "Recognition");

    controllerMappings.addComponent("KRecognition/components",
        "levelProgressPanel", "html", "Displays levels progress panel", "Recognition");

    controllerMappings.addComponent("KRecognition/components",
        "badgesPanel", "html", "Displays the achieved badges for a topic", "Recognition");

    g._onRecognitionAwarded = function (rf, event) {
        var award = event.award;
        var badge = award.recognition;
        var profile = award.awardedTo.asProfile();

        if (profile != null) {
            log.info("_onRecognitionAwarded award ID={}", award.id);
            var m = {
                'awardid': Utils.safeString(award.id),
                'createdDate': formatter.formatDateISO8601(award.createdDate),
                'badgeid': Utils.safeString(badge.id),
                'badgename': Utils.safeString(badge.name),
                'badgetitle': Utils.safeString(badge.title)
            };

            eventManager.goalAchieved(g.BADGE_AWARDED_GOAL_NAME, profile, m);
            
            services.forumManager.fireShareableItemEvent(profile, null, "Badge awarded", "KRecognition", award.id + "" );
        }
    }

    /**
     * API for creating a new topic
     *
     * @param {type} page
     * @param {type} params
     * @returns {unresolved}
     */
    g._createTopic = function (page, params) {
        var name = params.newName;
        var title = params.title;

        var newTopic;

        transactionManager.runInTransaction(function () {
            newTopic = applications.userApp.recognitionService.createTopic(name, title);
        });

        return views.jsonResult(true, "Created " + newTopic.title, newTopic.id);
    };

    /**
     * API to retrieve all the topics and there levels/badges in JSON
     *
     * @returns {undefined}
     */
    g._getTopicsAsJson = function () {
        var json = [];

        var allTopics = applications.userApp.recognitionService.allTopics;

        for (var i = 0; i < allTopics.size(); i++) {
            var topic = allTopics.get(i);

            var j = {
                id: topic.id,
                name: topic.name,
                title: topic.title,
                badges: [],
                levels: []
            };

            var badges = topic.badges;
            for (var b = 0; b < badges.size(); b++) {
                var badge = badges.get(b);

                j.badges.push({
                    id: badge.id,
                    name: badge.name,
                    title: badge.title
                });
            }

            var levels = topic.levels;
            for (var l = 0; l < levels.size(); l++) {
                var level = levels.get(l);

                j.levels.push({
                    id: level.id,
                    name: level.name,
                    title: level.title
                });
            }

            json.push(j);
        }

        return views.textView(JSON.stringify(json), 'application/json');
    };

    /**
     * API to delete an award
     *
     * @param {type} page
     * @param {type} params
     * @returns {undefined}
     */
    g._deleteAward = function (page, params) {
        var awardId = Utils.safeInt(params.awardid);

        transactionManager.runInTransaction(function () {
            applications.userApp.recognitionService.deleteAward(awardId);
        });

        return page.jsonResult(true, 'Success');
    };
})(this);