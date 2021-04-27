//Based on the algorithm proposed in "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).

const Diff = require('diff');

function validateData(prrule,data) {
    var body = data['body'];
    var prstat = Diff.diffLines(prrule,body,{ignoreWhitespace:true,newlineIsToken:true});
    return prstat;
}

module.exports = validateData;