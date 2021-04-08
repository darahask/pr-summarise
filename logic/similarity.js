var similarity = require('string-similarity');


function getSimilarity(prrule, cmrule, data) {
    var body = data['body'];
    var simval = similarity.compareTwoStrings(prrule,body);
    return simval;
}

module.exports = getSimilarity;