
function getDBInstance(page){
	var jsonDB = page.find('/jsondb');
	var redirectsDBName = "redirectsDB";
	var redirectsDB = jsonDB.child(redirectsDBName);
	return redirectsDB;
}


function addNewRedirect(page, params) {  
	
	log.info("addNewRedirect > page {} params {} files {}", page, params);

	var redirectsDB = getDBInstance(page);

	if(redirectsDB === null){
		log.info("Database not found");
		return;
	}
	var redirectJson = {
		id: params.id,
		url: params.url,
		target: params.target
	}

	if (redirectsDB.child(params.id) !== null) {
        page.throwBadRequest("Redirect already exists");
    }

	redirectsDB.createNew(params.id, JSON.stringify(redirectJson), "redirect");
	return views.jsonResult(true);
	
}

function getRedirects(page){

	log.info("getRedirects > page {}", page);  

	var redirectsDB = getDBInstance(page);
	if(redirectsDB === null){
		log.info("Database not found");
		return;
	}

	page.attributes.redirects = redirectsDB.findByType("redirect"); 

	return views.templateView("redirects-app/redirects.html");

}

function deleteRedirects(page, params){
	log.info("deleteRedirects > page {}", page);

	var redirectsDB = getDBInstance(page);
	if(redirectsDB === null){
		log.info("Database not found");
		return;
	}
	
	var deleteList = params.deleteList.split(',')
	for(var i = 0; i < deleteList.length; i++){
		
		var redirect = redirectsDB.child(deleteList[i]); 
		if(redirect){
			redirect.delete();
		}
	
	}
	
	return views.jsonResult(true);
}	


