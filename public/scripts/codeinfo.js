function fillCode(data){
    let htm = '';
    for(var i =0; i < data.length;i++){
        var s = data[i]['patch'].replace(/\n/g,'<br>');
        htm = htm + `<div class="card mt-2 mb-2">
        <div class="card-header">
            ${data[i]['name']}
        </div>
        <div class="card-body">
            <p class="card-text">${s}</p>
        </div>
    </div>`;
    }
    $('#code_main').html(htm);
}

$.get('/prinfo/codeinfo',function(data){
    fillCode(data);
})