function deleteShowing(id){
    $.ajax({
        url: '/showings/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
