function deleteMovie(id){
    $.ajax({
        url: '/movies/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
