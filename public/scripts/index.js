function getCardHtml(url,title,body,repo){
    return `<div class="card mt-2">
    <div class="card-header">
        ${repo}
    </div>
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${body}</p>
        <a href="${url}" class="btn btn-primary">Go somewhere</a>
    </div>
</div>`;
}

$("#pr_search").submit(function(event){
    event.preventDefault();
    var search_url = $("#search_url").val();
    $.ajax({
        type:'GET',
        url:search_url,
        success: function(pr){
            var cardHtml = "";
            pr.forEach(element => {
                cardHtml += getCardHtml(element['html_url'],element['title'],element['body'],element['base']['label'])
            });
            $('#pr_list').html(cardHtml);
        }
    })

});