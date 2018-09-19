controllerMappings
    .adminController()
    .pathSegmentName('ksurvey')
    .enabled(true)
    .defaultView(views.templateView('ksurveyapp/manageSurveys.html'))
    .addMethod('GET', 'getSurveys')
    .addMethod('POST', 'uploadSurveyImage', 'uploadSurveyImage')
    .addMethod('POST', 'saveSurvey', 'saveSurvey')
    .addMethod('POST', 'deleteSurvey', 'deleteSurvey')
    .addMethod('POST', 'clearSurveyResult', 'clearSurveyResult')
    .child(
        controllerMappings
            .adminController()
            .mountRepository("ksurvey-content-repo")
            .pathSegmentResolver('surveyId', 'findSurvey')
            .enabled(true)
            .defaultView(views.templateView('ksurveyapp/surveyDetail.html'))
            .addMethod('GET', 'getSurvey')
            .addMethod('POST', 'saveSurvey')
            .title('generateTitle')
            .child(
                controllerMappings
                    .adminController()
                    .enabled(true)
                    .pathSegmentName('survey-data.csv')
                    .addMethod('GET', 'getSurveyCSV')
            )
            .child(
                controllerMappings
                    .adminController()
                    .enabled(true)
                    .pathSegmentName('result')
                    .defaultView(views.templateView('ksurveyapp/surveyResult.html'))
                    .addMethod('GET', 'getSurvey')
                    .title('generateWebsiteTitle')
            )
    )
    .child(
        controllerMappings
            .adminController()
            .enabled(true)
            .pathSegmentName('saveGroupAccess')
            .addMethod('POST', 'saveGroupAccess')
    )
    .child(
        controllerMappings
            .adminController()
            .enabled(true)
            .pathSegmentName('clearResult')
            .addMethod('POST', 'clearResult')
    )
    .child(
        controllerMappings
            .adminController()
            .pathSegmentName('answer')
            .enabled(true)
            .addMethod('GET', 'deleteAnswer', 'deleteAnswer')
            .addMethod('GET', 'getPlainAnswers', 'getPlainAnswers')
            .addMethod('POST', 'saveAnswer', 'saveAnswer')
            .addMethod('POST', 'saveAnswerRequiredQuestions', 'saveAnswerRequiredQuestions')
    )
    .child(
        controllerMappings
            .adminController()
            .pathSegmentName('question')
            .enabled(true)
            .addMethod('GET', 'getQuestion', 'getQuestion')
            .addMethod('GET', 'deleteQuestion', 'deleteQuestion')
            .addMethod('GET', 'reorderQuestions', 'reorderQuestions')
            .addMethod('GET', 'reorderAnswers', 'reorderAnswers')
            .addMethod('POST', 'saveQuestion')
    )
    .build();

// admin controllers
controllerMappings
    .adminController()
    .path('/ksurveyapi/')
    .enabled(true)
    .addMethod('GET', 'getSurveysJson')
    .build();

controllerMappings
    .adminController()
    .path('/uploadSurveyImage/')
    .enabled(true)
    .addMethod('POST', 'uploadSurveyImage')
    .build();


// website controllers
controllerMappings
    .websiteController()
    .path('/ksurvey/')
    .enabled(true)
    .defaultView(views.templateView('ksurveyapp/manageSurveys.html'))
    .addMethod('GET', 'getSurveys')
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/')
    .enabled(true)
    .postPriviledge("READ_CONTENT")
    .addPathResolver('surveyId', 'findSurvey')
    .defaultView(views.templateView('ksurveyapp/surveyDetail.html'))
    .addMethod('GET', 'getSurvey')
    .addMethod('POST', 'submitSurvey')
    .title('generateWebsiteTitle')
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/result/')
    .enabled(true)
    .addPathResolver('surveyId', 'findSurvey')
    .defaultView(views.templateView('ksurveyapp/surveyResult.html'))
    .addMethod('GET', 'getSurvey')
    .title('generateWebsiteTitle')
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/result')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/myresult/')
    .enabled(true)
    .addPathResolver('surveyId', 'findSurvey')
    .defaultView(views.templateView('ksurveyapp/myResult.html'))
    .addMethod('GET', 'getSurvey')
    .title('generateWebsiteTitle')
    .build();

controllerMappings
    .websiteController()
    .path('/ksurvey/(?<surveyId>[^/]*)/myresult')
    .enabled(true)
    .addMethod("GET", "checkRedirect")
    .build();

function initApp(orgRoot, webRoot, enabled) {
    log.info("initApp ksurveyapp: orgRoot={}", orgRoot);

    var dbs = orgRoot.find('jsondb');
    var db = dbs.child(DB_NAME);

    if (isNull(db)) {
        log.info('{} does not exist!', DB_TITLE);

        db = dbs.createDb(DB_NAME, DB_TITLE, DB_NAME);

        setAllowAccess(db, true);

        saveMapping(db);
    }
}

function checkRedirect(page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        href = href + '/';
    }

    return views.redirectView(href);
}

controllerMappings.addGoalNodeType("ksurveySubmittedGoal", "ksurveyapp/ksurveySubmittedGoalNode.js", "onKsurveySubmittedGoal");

controllerMappings.addComponent("ksurveyapp", "ksurveyEmail", "email", "Shows button with link to survey", "Ksurvey App component");
controllerMappings.addComponent("ksurveyapp", "ksurveyForm", "html", "Shows survey form questions", "Ksurvey App component");
controllerMappings.addComponent("ksurveyapp", "ksurveyResult", "html", "Shows survey result", "Ksurvey App component");
controllerMappings.addComponent("ksurveyapp", "ksurveyMyResult", "html", "Shows user survey result", "Ksurvey App component");
controllerMappings.addComponent("ksurveyapp", "ksurveyList", "html", "Shows surveys list", "Ksurvey App component");
controllerMappings.journeyFieldsFunction(loadSurveyFields);

function loadSurveyFields(rootFolder, fields) {
    log.info('KSurvey: loadSurveyFields');
    var jsonDB = applications.KongoDB.findDatabase(DB_NAME);
    log.info('jsondb is {}', jsonDB);
    var questions = jsonDB.findByType(RECORD_TYPES.QUESTION);
    log.info('questions count {}', questions.length);
    questions.forEach(function (q) {
        log.info('question {}', q);
        var surveyId = q.jsonObject.surveyId;

        if (q.jsonObject.type == 1) {
            // Plain text question
            fields.addTextJourneyField("ksurvey-" + q.name, "KSurvey: " + q.jsonObject.title, function () {
                log.info('callback function {}', arguments);
                log.info('question name {}', q.name);

                var lead = arguments[0];
                var profileId = lead.profile === undefined ? lead.name : lead.profile.name;
                log.info("loadSurveyFields: profileid={}", profileId);
                return getKsurveyFields(profileId, q.name, surveyId, true);
            });

        } else {
            var answers = getAnswersByQuestion(q.name, surveyId);
            fields.addSelectJourneyField("ksurvey-" + q.name, "KSurvey: " + q.jsonObject.title, 'string', answers, ['contains', 'not_contains'], function () {
                log.info('callback function {}', arguments);
                log.info('question name {}', q.name);

                var lead = arguments[0];
                var profileId = lead.profile === undefined ? lead.name : lead.profile.name;

                log.info("loadSurveyFields: profileid={}", profileId);
                return getKsurveyFields(profileId, q.name, surveyId, false);
            });
        }

    });
}

function getKsurveyFields(profileId, questionId, surveyId, plainText) {
    var jsonDB = applications.KongoDB.findDatabase(DB_NAME);
    log.info('jsondb is {}', jsonDB);

    var db = jsonDB;
    if (db == null) {
        log.error("Could not find database " + DB_NAME);
        return null;
    }

    var queryJson = {
        'stored_fields': ['answerBody', 'answerId'],
        'query': {
            'bool': {
                'must': [
                    {'type': {'value': RECORD_TYPES.RESULT}},
                    {"term": {"userId": profileId}},
                    {"term": {"questionId": questionId}},
                    {"term": {"surveyId": surveyId}}
                ]
            }
        },
        'size': 100,
        'sort': [
            {"createdDate": "desc"}
        ]
    };

    // find most recent response from this profile
    var searchResult = db.search(JSON.stringify(queryJson));
    //log.info('getKsurveyFields search hit {}', searchResult.hits.totalHits);
    if (searchResult.hits.totalHits > 0) {
        if (plainText) {
            var hit = searchResult.hits.hits[0];
            // log.info('getKsurveyFields answerBody {}', hit.fields.answerBody.value);
            return hit.fields.answerBody.value;
        } else {
            var listAnswers = [];
            for (var i = 0; i < searchResult.hits.hits.length; i++) {
                var hit = searchResult.hits.hits[i];
                //log.info('getKsurveyFields answerId {}', hit.fields.answerId.value);
                // we need to return answer text to compare
                var answer = db.child(hit.fields.answerId.value);
                //log.info('getKsurveyFields answer body {}', answer.jsonObject.body);
                listAnswers.push(answer.jsonObject.body);
            }
            //log.info(' ZZANH {}', listAnswers);
            return listAnswers.join(' @KSURVEY@ ');
        }

    }
}

function getAnswersByQuestion(questionId, surveyId) {
    // log.info('getAnswersByQuestion is {} {}', questionId, surveyId);
    var jsonDB = applications.KongoDB.findDatabase(DB_NAME);
    // log.info('jsondb is {}', jsonDB);

    var db = jsonDB;
    if (db == null) {
        log.error("Could not find database " + DB_NAME);
        return null;
    }

    var queryJson = {
        'stored_fields': ['body'],
        'query': {
            'bool': {
                'must': [
                    {'type': {'value': RECORD_TYPES.ANSWER}},
                    {"term": {"questionId": questionId}},
                    {"term": {"surveyId": surveyId}}
                ]
            }
        },
        'size': 100
    };
    // find most recent response from this profile
    var searchResult = db.search(JSON.stringify(queryJson));
    //log.info('search hit {}', searchResult.hits.totalHits);
    var arr = [];
    for (var i = 0; i < searchResult.hits.hits.length; i++) {
        var hit = searchResult.hits.hits[i];
        //log.info('getAnswersByQuestion answer body {}', hit.fields.body.value);
        arr.push(hit.fields.body.value);
    }

    return arr;
}

function onKsurveySubmittedGoal(rootFolder, lead, funnel, eventParams, customNextNodes, customSettings, event, attributes) {
    log.info('onKsurveySubmittedGoal customSettings {}', customSettings);
    log.info('onKsurveySubmittedGoal event parameters {}', event.parameters);

    if (customSettings && eventParams && eventParams.survey && customSettings.survey) {
        return customSettings.survey === eventParams.survey;
    }
    return true;
}

controllerMappings.setUserTimelineFunction('generateTimelineItems');

function generateTimelineItems(page, user, list){
    var sumissions =  getUserSubmissions(page, user.name);
    var db = getDB(page);
    if (sumissions.hits.totalHits > 0){
        for (var i in sumissions.hits.hits){
            var hit = sumissions.hits.hits[i];
            var survey = db.child(hit.source.surveyId);
            var streamItem = applications.stream.streamEventBuilder()
                .profile(user)
                .title('Submitted survey: ' + survey.jsonObject.title)
                .desc(survey.jsonObject.description)
                .date(formatter.toDate(hit.source.createdDate))
                .category('info')
                .inbound(true)
                .path('/ksurvey/' + survey.name + '/result/?profileId=' + user.userId)
                .icon('fa-trophy')
                .build();

            list.add(streamItem);
        }

    }
}