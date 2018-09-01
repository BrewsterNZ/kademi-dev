controllerMappings.addComponent("learner/components", "modulesTile", "html", "Displays available modules for current user in tile format", "Learning App;Tile component");
controllerMappings.addComponent("learner/components", "modulesList", "html", "Displays modules in list or grid format", "Learning App");
controllerMappings.addComponent("learner/components", "coursePicker", "html", "Displays course picker", "Learning App");
controllerMappings.addComponent("learner/components", "courseDescription", "html", "Displays course description", "Learning App");
controllerMappings.addComponent("learner/components", "moduleStatuses", "html", "Displays table of module statuses", "Learning App");
controllerMappings.addComponent("learner/components", "userModuleStatuses", "html", "Displays table of module statuses for the logged in user", "Learning App");
controllerMappings.addComponent("learner/components", "certificates", "html", "Lists the user's certificates", "Learning App");
controllerMappings.addComponent("learner/components", "certificate", "html", "Shows certificate content", "Learning App");

controllerMappings.addQuery("/APP-INF/queries/learningCompletedModules.query.json", ["profile"], []);
controllerMappings.addQuery("/APP-INF/queries/learningStartedModules.query.json", ["profile"], []);

controllerMappings.addTableDef("tableLearnersCompletedCourses", "Learners Completed Courses", "loadLearnersCompletedCourses")
    .addHeader("Name")
    .addHeader("Join Data")
    .addHeader("Last Login Date")
    .addHeader("Compeleted Courses");
    
function loadLearnersCompletedCourses(start, maxRows, rowsResult, rootFolder) {  
    
    var profileQuery = {
        "stored_fields":[
            "lastVisit",
            "firstName",
            "surName",
            "userId"
        ],
       "query": {
            "bool": {
              "must": [  
                    {
                        "type": {
                            "value": "profile"
                        }
                    }
                ]
            }
        },
        "size":10000
    }
            
    var searchOrgs = queryManager.selectedOrgIds;
    
    if (searchOrgs === undefined|| searchOrgs.length === 0){
        searchOrgs = queryManager.availableOrgIds;
    }
    
    var arr = [];
    searchOrgs.forEach(function (item) {
        arr.push(item);
    });
    profileQuery.query.bool.must.push({
        "terms": {
            "parentOrgs": arr
        }
    });
    
    var sm = applications.search.searchManager;
    var profileResp = sm.search(JSON.stringify(profileQuery), 'profile');
    
    for (var index in profileResp.hits.hits) {         
        rowsResult.addRow();
        
        var profile = profileResp.hits.hits[index];        
        var user = applications.userApp.findUserResourceById(profile.fields.userId.value);
        if (user) {
            var link = "";
            if(http.request.params.as == 'csv'){
                link = user.thisUser.formattedName ;
            }else{
                link = "<a href='/custs/" + user.name + "'>" + user.thisUser.formattedName + "</a>";
            }
            
            rowsResult.addCell(link);
            rowsResult.addCell(user.createDate ? formatter.formatDate(user.createDate) : "-");                   
        } else {
            rowsResult.addCell("-");
            rowsResult.addCell("-");
        }
        
        var lastVisitQuery = {
                "stored_fields": [ "reqDate", "reqUrl", "reqUser"],
                 "query": {
                     "bool": {
                         "must": [                             
                             {
                                 "term": {
                                     "resultCode": 200
                                 }
                             },
                             {
                                 "prefix": {
                                     "contentType": "text/html"
                                 }
                             },
                             {
                                 "exists" : { "field" : "website" }
                             },
                             {
                                 "term":{
                                     "reqUser": user.thisProfile.name 
                                 }
                             }
                         ]
                     }
                 },    
                 "sort" : [
                   {"reqDate" : {"order" : "desc"}}
                ],
                 "size": 1
            };
        
        var lastVisitResp = sm.search(JSON.stringify(lastVisitQuery), 'log');
        
        if(lastVisitResp.hits.hits.length > 0){            
            rowsResult.addCell( formatter.formatDate(formatter.toDate(lastVisitResp.hits.hits[0].fields.reqDate.value))); 
        }else{
            rowsResult.addCell("-");
        }
        
        
        var userModules = applications.learning.findAvailableModulesForProfile(user.profile);                
        
        var availableModulesIds = [];
        for(var i in userModules){
            if(userModules[i].findModuleStatus(user.thisProfile)){
                availableModulesIds.push( userModules[i].findModuleStatus(user.thisProfile).moduleCode ); 
            }
        }
        
        var learingQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "type": {
                                "value": "moduleStatus"
                            }
                        },
                        {
                            "term": {
                                "profile": user.userId 
                            }
                        },                        
                        {
                            "term": {
                                "complete": "true"
                            }
                        },
                        {
                            "terms": {
                                "moduleCode": availableModulesIds
                            }
                        }
                    ]
                }
            },  
            "aggs": {                 
                "completed_courses":{  
                    "value_count" : { 
                        "field" : "complete" 
                    } 
                }                
            },
            "size": 1000,
            "from": 0
        };
                
        var learningResp = sm.search(JSON.stringify(learingQuery), 'profile');
        var completedModules = learningResp.aggregations.get("completed_courses").value;
       
        var completedModulesPercent = formatter.toPercent(completedModules, userModules.length, true, false, 0);
                
        rowsResult.addCell(completedModulesPercent);
        rowsResult.flush();
        
    }                    
}


controllerMappings.addTableDef("tableLearnersModulesDetails", "Learners Modules Details", "loadLearnersModulesDetails")
    .addHeader("Program")
    .addHeader("Course")
    .addHeader("Module")
    //.addHeader("Certificate")
    .addHeader("Renewal")
    .addHeader("Expire")
    .addHeader("Date completed");
    
    
function loadLearnersModulesDetails(start, maxRows, rowsResult, rootFolder) {        
    
    var profileId = http.request.params.profileId;
    var user = applications.userApp.findUserResource(profileId);
    var modulesResp = applications.learning.searchModuleStatuses(profileId, start, maxRows);
    var records = formatter.sortReverse(modulesResp.records);
        
    for(var i in records){
        var record = records[i];
        
//        var link = "";        
//        var module = rootFolder.find("/programs/"+record.programCode+"/"+record.courseCode+"/"+record.moduleCode);  
//        if(module){            
//            var certificates = module.certificateHrefs(user, record);                
//            if (record.complete && certificates.length > 0){                
//                if(http.request.params.as == 'csv'){
//                    link = "Certificate earned" ;
//                }else{
//                    link = "<a href='"+ certificates[0] +"'> view </a>";
//                }                
//            }        
//        }
        
        rowsResult.addRow();
        
        rowsResult.addCell(record.programCode);
        
        var course = rootFolder.find("/programs/" + record.programCode + "/" + record.courseCode);
        
        rowsResult.addCell(course.title);
        rowsResult.addCell(record.moduleCode);
        // rowsResult.addCell(link);
        rowsResult.addCell(formatter.formatDate(record.renewalDate));
        rowsResult.addCell(formatter.formatDate(record.expiryDate));
        if(record.complete){
           rowsResult.addCell(formatter.formatDate(record.modifiedDate)); 
        }else{
            rowsResult.addCell("In Progress"); 
        }
        
        rowsResult.flush();    
    }
            
}

function buildTableModuleStatuses(programCode, courseCode, moduleCode, complete, profile) {
    var query = {
        "query": {
            "bool": {
                "must": [
                    {
                        "type": {
                            "value": "moduleStatus"
                        }
                    }
                ]
            }
        },
        "aggs": {
            "byProgramCode": {
                "terms": {
                    "field": "programCode"
                }
            },
            "byCourseCode": {
                "terms": {
                    "field": "courseCode"
                }
            },
            "byModuleCode": {
                "terms": {
                    "field": "moduleCode"
                }
            }
        },
        "size": 1000,
        "from": 0
    };

    if (complete){
        query.query.bool.must.push({
            "term": {
                "complete": complete == 'true'
            }
        });
    }

    if (moduleCode){
        query.query.bool.must.push({
            "term": {
                "moduleCode": moduleCode
            }
        });
    }

    if (courseCode){
        query.query.bool.must.push({
            "term": {
                "courseCode": courseCode
            }
        });
    }

    if (programCode){
        query.query.bool.must.push({
            "term": {
                "programCode": programCode
            }
        });
    }

    if (profile){
        query.query.bool.must.push({
            "term": {
                "profile": profile
            }
        });
    }

    if (queryManager.selectedOrgIds && queryManager.selectedOrgIds.length){
        var arr = [];
        queryManager.selectedOrgIds.forEach(function (item) {
            arr.push(item);
        });
        query.query.bool.must.push({
            "terms": {
                "parentOrgs": arr
            }
        });
    }
    var sm = applications.search.searchManager;
    var resp = sm.search(JSON.stringify(query), 'profile');
    return resp;
}