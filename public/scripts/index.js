function getCardHtml(url,title,body,repo){
    return `<div class="card mt-2 mb-2">
    <div class="card-header">
        ${repo}
    </div>
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">PR Number:${body}</p>
        <button onclick = "moreInfo('${url}')" class="btn btn-primary ">More Info</button>
    </div>
</div>`;
}

$("#pr_search").submit(function(event){
    event.preventDefault();
    var search_url = "https://api.github.com/repos/" + $("#search_url").val() + "/pulls";
    $.ajax({
        type:'GET',
        url:search_url,
        success: function(pr){
            var cardHtml = "";
            pr.forEach(element => {
                cardHtml += getCardHtml(element['url'],element['title'],element['number'],element['base']['label'])
            });
            $('#pr_list').html(cardHtml);
        }
    })

});

function moreInfo(data){
    var urldata = {};
	urldata.url = data;
    $.post('/prinfo',urldata).done(function(data){
        window.location.href = "/prinfo"
    });
}