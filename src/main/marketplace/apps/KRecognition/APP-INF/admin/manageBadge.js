/* global controllerMappings, views, transactionManager, applications, formatter, Utils, fileManager */

(function (g) {
    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)/badges/(?<badgeId>[^/]*)')
            .addMethod('GET', 'checkRedirect')
            .build();

    controllerMappings
            .adminController()
            .enabled(true)
            .path('/recognition/(?<topicId>[^/]*)/badges/(?<badgeId>[^/]*)/')
            .addPathResolver('topicId', 'resolveTopicId')
            .addPathResolver('badgeId', 'resolveBadgeId')
            .defaultView(views.templateView('/theme/apps/KRecognition/manageBadge.html'))
            .build();
})(this);