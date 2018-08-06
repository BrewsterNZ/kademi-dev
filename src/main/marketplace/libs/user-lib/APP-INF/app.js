controllerMappings.addQuery("/APP-INF/queries/registrationsOverTime.query.json", ["signuplog"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/membersSpentPoint.query.json", ["rewardpointsdebit"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/membersEarnedPoint.query.json", ["rewardPoints"], ["ReportsViewer"]);

controllerMappings.addQuery("/APP-INF/queries/orgsSpentPoint.query.json", ["rewardpointsdebit"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/orgsEarnedPoint.query.json", ["rewardPoints"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/membersOrgs.query.json", ["profile"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/membersOrgsByGroup.query.json", ["profile"], ["ReportsViewer"]);
controllerMappings.addQuery("/APP-INF/queries/memberTableOrgPoints.query.json", ["org"], ["ReportsViewer"]);

controllerMappings.addComponent("user/components", "recentUserRegistrations", "html", "Display recent registrations", "User App component");
controllerMappings.addComponent("user/components", "recentActiveUsers", "html", "Display recent active users", "User App component");
controllerMappings.addComponent("user/components", "registrationsOverTime", "html", "Display a line graph of registrations over time", "User App component");
controllerMappings.addComponent("user/components", "membersTable", "html", "Display a table of members", "User App component");
controllerMappings.addComponent("user/components", "loginAsUser", ['lead', 'profile', 'user'], "Login as a user", "User App component");

controllerMappings
        .websiteController()
        .enabled(true)
        .isPublic(true)
        .path('/profile-memberships')
        .addMethod('POST', 'newMembership')
        .postPriviledge("READ_CONTENT")
        .build();


function newMembership(page, params, files, form) {
    var groupName = form.rawParam("groupName");
    var orgId = form.rawParam("orgId");
    var profile = securityManager.currentUser.thisProfile;
    log.info("newMembership: profile={} org={} group={}", profile, orgId, groupName);

    if (formatter.isEmpty(groupName)) {
        return views.jsonResult(false, "No group specified");
    }
    if (formatter.isEmpty(orgId)) {
        return views.jsonResult(false, "No orgId specified");
    }

    var group = services.userManager.group(groupName);
    if (group == null) {
        return views.jsonResult(false, "Couldnt find group " + groupName);
    }

    var org = services.userManager.findOrg(orgId);
    if (org == null) {
        return views.jsonResult(false, "Couldnt find org " + orgId);
    }

    if (group.closedGroup) {
        return views.jsonResult(false, "Group is not available " + groupName);
    }

    var jresult = null;
    transactionManager.runInTransaction(function () {
        if (group.openGroup) {
            var m = services.userManager.findOrCreateMembership(profile, group, org);
            if (m == null) {
                jresult = views.jsonResult(false, "Could not create membership, please contact your administrator");
            } else {
                log.info("newMembership: Membership ID={}", m.id);
                jresult = views.jsonResult(true, "Found or created membership " + m.id);
            }
        } else {
            // needs approval
            var app = services.userManager.newMembershipApplication(profile, group, org, form);
            log.info("newMembership: created application {}", app.id);
            jresult = views.jsonResult(true, "Submitted membership application " + app.id);
        }
    });
    return jresult;
}