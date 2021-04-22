const Diff = require('diff');

function validateData(prrule,data) {
    var body = data['body'];
    var prstat = Diff.diffLines(prrule,body,{ignoreWhitespace:true,newlineIsToken:true});
    return prstat;
}

module.exports = validateData;