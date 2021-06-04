function deleteCustomer(id){
    $.ajax({
        url: '/customers/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
