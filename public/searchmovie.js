function searchMovieByTitle() {
    //get the movie title
    console.log("button works!")
    var movie_title_search_string  = document.getElementById('movie_title_search_string').value
    //construct the URL and redirect to it
    window.location = '/movies/search/' + encodeURI(movie_title_search_string)
}

function searchtest() {
    console.log("searchtest button works!")
}