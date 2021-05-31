function searchMovieByTitle() {
    //get the movie title
    var movie_title_search_string  = document.getElementById('movie_title_search_string').value
    //construct the URL and redirect to it
    window.location = '/movies/search/' + encodeURI(movie_title_search_string)
}
