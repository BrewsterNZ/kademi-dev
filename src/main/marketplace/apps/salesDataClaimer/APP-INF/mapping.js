var recordMapping = {
    "properties": {
        "recordId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "soldDate": {
            "store": true,
            "type": "date"
        },
        "enteredDate": {
            "store": true,
            "type": "date"
        },
        "modifiedDate": {
            "store": true,
            "type": "date"
        },
        "ocrFileHash": {
          "type": "keyword",
          "store": true,
          "fields": {
            "text": {
              "type": "text"
            }
          }
        },
        "amount": {
            "type": "long",
            "store": true
        },
        "status": {
            "type": "long",
            "store": true
        },
        "soldBy": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "soldById": {
            "type": "long",
            "store": true
        },
        "productSku": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "receipt": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "claimGroupId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },        
        "claimType": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },        
        "claimField1": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },        
        "claimField2": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },        
        "claimField3": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },        
        "claimField4": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },        
        "claimField5": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },        
        "taggedFromSalesRecordId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        }
    }
};

var claimGroupMapping = {
    "properties": {
        "claimGroupId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "enteredDate": {
          "type": "date",
          "store": true
        },    
        "contactRequest": {
            "type": "long",
            "store": true
        }
    }
};

var claimItemMapping = {
    "properties": {
        "recordId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "soldDate": {
            "store": true,
            "type": "date"
        },
        "modifiedDate": {
            "store": true,
            "type": "date"
        },
        "amount": {
            "type": "long",
            "store": true
        },
        "soldBy": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "soldById": {
            "type": "long",
            "store": true
        },
        "productSku": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        },
        "claimRecordId": {
            "type": "keyword",
            "store": true,
            "fields": {
                "text": {
                    "type": "text"
                }
            }
        }
    }
};