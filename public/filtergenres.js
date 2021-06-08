function filterMovieByGenre() {
    //get the id of the selected homeworld from the filter dropdown
    var genre_id = document.getElementById('genre_filter').value
    //construct the URL and redirect to it
    window.location = '/movies/filter/' + parseInt(genre_id)
}
