var recordMapping = {
    "properties": {
        "notes": {
            "store": true,
            "type": "text"
        },
        "sourceUrl": {
            "type": "keyword",
            "store": true
        },
        "targetUrl": {
            "type": "keyword",
            "store": true
        },
        "status": {
            "store": true,
            "type": "boolean"
        },
        "modifiedDate": {
            "store": true,
            "type": "date"
        },
        "createdDate": {
            "store": true,
            "type": "date"
        },
        "createdBy": {
            "store": true,
            "type": "text"
        },
        "modifiedBy": {
            "store": true,
            "type": "text"
        },
        "website": {
            "store": true,
            "type": "text"
        }
    }
};