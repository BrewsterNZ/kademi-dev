var APP_NAME = 'KTimesheets';

controllerMappings
        .websiteController()
        .path('/timesheets/')
        .defaultView(views.templateView('/theme/apps/KTimesheets/viewTimesheet.html'))
        .postPriviledge('READ_CONTENT')
        .addMethod('POST', 'saveTime', 'hours')
        .addMethod('POST', 'submitTimesheet', 'submitTimesheet')
        .enabled(true)
        .build();

controllerMappings
        .websiteController()
        .path('/team-tasks/')
        .defaultView(views.templateView('/theme/apps/KTimesheets/viewTeamTasks.html'))
        .postPriviledge('READ_CONTENT')
        .enabled(true)
        .build();

controllerMappings.addComponent("KTimesheets", "timesheet", "web", "Shows a table to enter timesheet hours", "KTimesheets component");
controllerMappings.addComponent("KTimesheets", "timesheetSummary", "lead", "Shows hours related to a lead on the lead page", "KTimesheets component");
controllerMappings.addComponent("KTimesheets", "timesheetTasks", "lead", "A list of users and what leads/tasks they're assigned to", "KTimesheets component");


function submitTimesheet(page, params) {
    try{
        transactionManager.runInTransaction(function () {
            var startDate = formatter.toDate(params.startDate);
            var finishDate = formatter.toDate(params.finishDate);
            log.info("submitTimesheet: start={} finish={}",startDate, finishDate);
            services.timesheetManager.submit(startDate, finishDate);
        });
        return views.jsonView(true, "Saved");
    } catch(ex) {
        return views.jsonView(false, "Error: " + ex.message);
    }

}

function saveTime(page, params, files, form) {
    try {
        transactionManager.runInTransaction(function () {
            var item = params.item;
            var hours = formatter.toDouble( params.hours );
            var date2 = form.dateParam("date");
            date2 = formatter.addHours(date2, 24); // HACK HACK HACK. Needed this to get working in US cluster, but not obviously not right!

            log.info("saveTime: hours={} date={} item={} orig-date={}", hours, date2, item, params.date);
            services.timesheetManager.addUpdateHours(item, hours, date2);
        });

        return views.jsonView(true, "Saved");
    } catch(ex) {
        return views.jsonView(false, "Error: " + ex.message);
    }
}


// ============================================================================
// Settings
// ============================================================================
function saveSettings(page, params) {
    log.info('saveSettings > page={}, params={}', page, params);

    var standardItems = params.standardItems || '';

    page.setAppSetting(APP_NAME, 'standardItems', standardItems);

    return views.jsonResult(true);
}


function getAppSettings(page) {
    log.info('getAppSettings > page={}', page);

    var websiteFolder = page.closest('websiteVersion');
    var org = page.organisation;
    var branch = null;

    if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
        branch = websiteFolder.branch;
    }

    var app = applications.get(APP_NAME);
    if (app !== null) {
        var settings = app.getAppSettings(org, branch);
        return settings;
    }

    return null;
}