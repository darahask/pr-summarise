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

function fillPkgAnalysis(data) {
    var htm = `<b>Similarity with the guildelines: </b>${data.similarity * 100} %`;
    $("#simcode").html(htm);
    var myhtm = '';
    data.validation.forEach(element => {
        myhtm += `<li class="list-group-item"><b>Line: </b>${element['value']}<br>
        <b>Added To Rule: </b>${element['added']}<br>
        <b>Removed From Rule: </b>${element['remove']}<br></li>`;
    });
    $("#pkgcheck").append(myhtm);
}

function startFetch() {
    $.get('/prinfo/codeinfo', function (data) {
        fillCode(data);
    });
    console.log('went')
    $.get('/prinfo/pkgcheck', function (data) {
        console.log('went')
        fillPkgAnalysis(data);
    });
}

startFetch();