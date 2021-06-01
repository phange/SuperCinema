function updateShowing(id){
    $.ajax({
        url: '/showings/' + id,
        type: 'PUT',
        data: $('#update-showing').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
