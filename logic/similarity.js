//function to find similarity between two strings based on Dice's Coefficient which is better than Levenshtein distance.
var similarity = require('string-similarity');


function getSimilarity(prrule,data) {
    var body = data['body'];
    var simval = similarity.compareTwoStrings(prrule,body);
    return simval;
}

module.exports = getSimilarity;