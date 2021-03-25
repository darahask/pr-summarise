function displayData(data){
    //setting up pr main card
    var body = data['body'];
    var title = data['title'];
    var html_url = data['html_url'];
    var card = `<div class="card mt-2 mb-2">
        <div class="card-header">
            <a href="${html_url}">MoreInfo</a>
        </div>
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p id = "prbody" class="card-text">${body}</p>
        </div>
    </div>`
    $('#pr_main').append(card);
    var md = window.markdownit();
    var s = md.render(body);
    $('#prbody').html(s);
    
    //setting up more info card
    $("#uname").html("<b>UserName: </b>" + data['user']['login']);
    $("#commits").html("<b>Number of Commits: </b>" + data['commits']);
    $("#fileschanged").html("<b>Number of files changed: </b>" + data['changed_files']);
    $("#additions").html("<b>Additions: </b>" + data['additions']);
    $("#deletions").html("<b>Deletions: </b>" + data['deletions']);
    $("#mergeable").html("<b>Mergeable: </b>" + data['mergeable']);
}

function fillData(data){
    var myhtm = "";
    data.forEach(element => {
        myhtm += `<li class="list-group-item"><b>Line: </b>${element['value']}<br>
        <b>Added To Rule: </b>${element['added']}<br>
        <b>Removed From Rule: </b>${element['remove']}<br></li>`;
    });
    $("#resval").html(myhtm);
}

function validateData(data){
    var thedata = {};
	thedata.data = data;
    $.post('/prinfo/validate',thedata).done(function(data){
        fillData(data);
    });
}

$(window).on('load',function(){
    var prurl = $('#prurl').attr('href');
    $.get(prurl,function(data){
        displayData(data);
        validateData(data);
    });
});