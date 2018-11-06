controllerMappings.addComponent("content/components", "socialLinks", "html", "Displays the social links", "Content App component");
controllerMappings.addComponent("content/components", "errorDetails", "html", "Displays detailed error page", "Content App component");
controllerMappings.addComponent("content/components", "htmlPanel", "html", "Displays panel with text and icon", "Content App component");
controllerMappings.addComponent("content/components", "showHideButton", "html", "A button which causes all following content to be initially hidden, and is only shown when clicked", "Content App component");
controllerMappings.addComponent("content/components", "rating", "html", "Shows a rating stars which is predefined by admin", "Content App component");
controllerMappings.addComponent("content/components", "tile", "html", "Shows a tile which contains image, text and link", "Content App component");

// Asset stuff
var anyType = formatter.newArrayList();
anyType.add("html");
anyType.add("edm");

controllerMappings.addComponent("content/components", "assetQueryList", anyType, "Shows a list of assets from an asset query", "Content App component");
controllerMappings.addComponent("content/components", "assetEditForm", "html", "Shows a default edit form for assets");

controllerMappings.addComponent("content/components", "photo")
        .addType("html")
        .desc("Photo block")
        .categories("Content App component")
        .addDefaultAtt("photo-src", "/static/images/somewhere_bangladesh.jpg")
        .addDefaultAtt("photo-align", "left")
        .addDefaultAtt("photo-valign", "")
        .addDefaultAtt("photo-style", "")
        .addDefaultAtt("photo-responsive", "true")
        .addDefaultAtt("photo-width", "500")
        .addDefaultAtt("photo-height", "336")
        .addDefaultAtt("photo-alt", "")
        .addDefaultAtt("photo-linkable", "false")
        .addDefaultAtt("photo-link", "")
        .addDefaultAtt("photo-link-target", "")
        .build();

controllerMappings.addComponent("content/components", "assetQueryText", anyType, "Displays text assets from a query", "Content App component");

controllerMappings.addComponent("content/components", "video")
        .addType("html")
        .desc("Video block")
        .categories("Content App component")
        .addDefaultAtt("video-src", "/theme/apps/content/kademi-video.mp4")
        .addDefaultAtt("video-autostart", "false")
        .addDefaultAtt("video-ratio", "4:3")
        .addDefaultAtt("video-repeat", "false")
        .addDefaultAtt("video-controls", "true")
        .addDefaultAtt("video-border", "")
        .addDefaultAtt("video-border-width", "")
        .addDefaultAtt("video-border-color", "")
        .addDefaultAtt("video-border-style", "")
        .build();

controllerMappings.addComponent("content/components", "photoEDM")
        .addType("edm")
        .desc("Photo block")
        .categories("Content App component")
        .addDefaultAtt("photo-src", "http://www.kademi.co/static/images/somewhere_bangladesh.jpg")
        .addDefaultAtt("photo-align", "left")
        .addDefaultAtt("photo-fullwidth", "true")
        .addDefaultAtt("photo-alt", "")
        .addDefaultAtt("photo-linkable", "false")
        .addDefaultAtt("photo-link", "")
        .addDefaultAtt("photo-link-target", "")
        .build();

controllerMappings.addComponent("content/components", "countdown", "html", "Shows a countdown timer from a date", "Content App component");
controllerMappings.addComponent("content/components", "menu2", "file", "Displays a menu, with big search box", "Content App component");
controllerMappings.addComponent("content/components", "menu3", "file", "Displays a menu, with big search box, and only single dropdown menu", "Content App component");