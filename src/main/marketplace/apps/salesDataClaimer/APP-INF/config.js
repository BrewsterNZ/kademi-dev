var APP_NAME = 'salesDataClaimer';
var DB_NAME = 'salesDataClaimer';
var DB_TITLE = 'SalesDataClaimer Db';
var JSON_DB = '/jsondb';
var TYPE_RECORD = 'record';
var LEAD_CLAIM_ID = 'claim_recordId';
var CLAIM_TYPE = 'claim_type';

var DB_MAPPINGS = {
    record: recordMapping
};
var RECORD_STATUS = {
    NEW: 0,
    APPROVED: 1,
    REJECTED: -1
};