var RECORD_TYPES = {
    SURVEY: 'survey',
    QUESTION: 'question',
    ANSWER: 'answer',
    RESULT: 'result',
    SUBMIT: 'submit'
};

var surveyMapping = {
    "properties": {
        "name": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "title": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "description": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "image": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
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
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "modifiedBy": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "startTime": {
            "store": true,
            "type": "date"
        },
        "endTime": {
            "store": true,
            "type": "date"
        },
        "groups": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "websites": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        }
    }
};

var questionMapping = {
    "properties": {
        "title": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "body": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "answerLayout": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "surveyId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
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
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "type": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "order": {
            "store": true,
            "type": "long"
        },
        "required": {
            "store": true,
            "type": "keyword"
        }
    }
};

var answerMapping = {
    "properties": {
        "questionId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "body": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "surveyId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
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
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "order": {
            "store": true,
            "type": "long"
        },
        "requiredQuestions": {
            "store": true,
            "type": "text"
        }
    }
};

var surveySubmitsMapping = {
    "properties": {
        "surveyId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "userId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "createdDate": {
            "store": true,
            "type": "date"
        },
        "fromAddress": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "browserName": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "browserVersion": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "osName": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "osVersion": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        },
        "deviceModel": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "deviceVendor": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "deviceType": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        }
    }
};

var resultMapping = {
    "properties": {
        "surveyId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "questionId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "answerId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "userId": {
            "eager_global_ordinals": true,
            "store": true,
            "type": "keyword",
            "fields": {
                "text": {
                    "fielddata": true,
                    "store": true,
                    "type": "text"
                }
            }
        },
        "createdDate": {
            "store": true,
            "type": "date"
        },
        "answerBody": {
            "fielddata": true,
            "store": true,
            "type": "text",
            "fields": {
                "keyword": {
                    "store": true,
                    "type": "keyword"
                }
            }
        }
    }
};
