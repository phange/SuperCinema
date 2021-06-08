function deleteGenre(id){
    $.ajax({
        url: '/genres/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
