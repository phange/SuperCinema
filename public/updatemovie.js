function updateMovie(id){
    $.ajax({
        url: '/movies/' + id,
        type: 'PUT',
        data: $('#updateMovie').serialize(),  // update-person
        success: function(result){
            window.location.replace("./");
        }
    })
};
