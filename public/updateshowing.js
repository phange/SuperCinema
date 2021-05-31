function updateShowing(id){
    $.ajax({
        url: '/people/' + id,
        type: 'PUT',
        data: $('#update-showing').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
