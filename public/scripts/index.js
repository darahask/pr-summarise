function getCardHtml(reponame,fullname, url, title, body, repo) {
    return `<div class="card mt-2 mb-2">
    <div class="card-header">
        ${repo}
    </div>
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">PR Number:${body}</p>
        <button onclick = "moreInfo('${url}','${fullname}','${reponame}')" class="btn btn-primary ">More Info</button>
    </div>
</div>`;
}

function moreInfo(data, fullname,reponame) {
    var urldata = {};
    urldata.url = data;
    urldata.fullname = fullname;
    urldata.reponame = reponame;
    $.post('/prinfo', urldata).done(function (data) {
        window.location.href = "/prinfo"
    });
}

$("#pr_search").submit(function (event) {
    event.preventDefault();
    var search_url = "https://api.github.com/repos/" + $("#search_url").val() + "/pulls";
    localStorage.setItem('search',$("#search_url").val());
    $.ajax({
        type: 'GET',
        url: search_url,
        success: function (pr) {
            var cardHtml = "";
            pr.forEach(element => {
                cardHtml += getCardHtml(element['base']['repo']['full_name'], element['head']['repo']['full_name'], element['url'], element['title'], element['number'], element['base']['label'])
            });
            $('#pr_list').html(cardHtml);
            localStorage.setItem("prs",cardHtml);
        }
    })
});

window.onload = function(e){
    var html = localStorage.getItem("prs");
    document.getElementById('search_url').value = localStorage.getItem('search');
    if(html != null){
        $('#pr_list').html(html);
    }
}