controllerMappings
        .adminController()
        .path("/redirects/")
        .enabled(true)
        .defaultView(views.templateView("/theme/apps/redirects-app/redirections.html"))
        .addMethod("GET", "handleCoffee")
        .enabled(true)
        .build();