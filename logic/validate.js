const Diff = require('diff');

function validateData(prrule, cmrule, data) {
    var body = data['body'];
    var prstat = Diff.diffLines(prrule,body,{ignoreWhitespace:true,newlineIsToken:false});
    return prstat;
}

module.exports = validateData;