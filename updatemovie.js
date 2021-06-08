function updateMovie(id){
    $.ajax({
        url: '/movies/' + id,
        type: 'PUT',
        data: $('#update-movie').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
