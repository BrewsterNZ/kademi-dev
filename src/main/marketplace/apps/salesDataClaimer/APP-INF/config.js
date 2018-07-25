var APP_NAME = 'salesDataClaimer';
var DB_NAME = 'salesDataClaimer';
var DB_TITLE = 'SalesDataClaimer Db';
var JSON_DB = '/jsondb';
var TYPE_RECORD = 'record';
var TYPE_CLAIM_GROUP = 'claim_group';
var LEAD_CLAIM_ID = 'claim_recordId';
var LEAD_CLAIM_GROUP_ID = 'claim_group_recordId';
var CLAIM_TYPE = 'claim_type';
var DB_MAPPINGS = {
    record: recordMapping,
    claim_group: claimGroupMapping
};
var RECORD_STATUS = {
    NEW: 0,
    APPROVED: 1,
    REJECTED: -1
};