//filling of data from backend using ajax
function fillCode(data) {
    let htm = '';
    for (var i = 0; i < data.length; i++) {
        var s = data[i]['patch'].replace(/\n/g, '<br>');
        htm = htm + `<div class="card mt-2 mb-2">
        <div class="card-header">
            ${data[i]['name']}
        </div>
        <div class="card-body">
            <p class="card-text">${s}</p>
        </div>
    </div>`;
    }
    $('#code_main').append(htm);
}

function fillPkgAnalysis(unit) {
    var myhtm = "";
    unit.forEach((data) => {
        myhtm += `<li class="list-group-item active" id='simcode'><b>Similarity with the guildelines: </b>${data.similarity * 100} %<br>
        <b>File Path: </b>${data.path}</li>`;
        data.validation.forEach(element => {
            myhtm += `<li class="list-group-item"><b>Line: </b>${element['value']}<br>`;
            if (element['added'] != null) {
                myhtm += `<b>Added To Rule: </b>${element['added']}<br></br>`;
            }
            if (element['remove'] != null) {
                myhtm += `<b>Removed From Rule: </b>${element['remove']}<br></li>`;
            }
            if ((element['added'] != null) && (element['remove'] != null)) {
                myhtm += `<b>Added To Rule: </b>${element['added']}<br></br>`;
                myhtm += `<b>Removed From Rule: </b>${element['remove']}<br></li>`;
            }
        });
    })
    $("#pkgcheck").append(myhtm);
}
// function to start fetching
function startFetch() {
    $.get('/prinfo/codeinfo', function (data) {
        fillCode(data);
    });
    $.get('/prinfo/pkgcheck', function (data) {
        fillPkgAnalysis(data);
    });
}
//starting fetch
startFetch();