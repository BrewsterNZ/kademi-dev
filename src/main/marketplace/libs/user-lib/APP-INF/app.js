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