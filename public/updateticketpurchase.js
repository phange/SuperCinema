function updateTicketPurchase(id){
    $.ajax({
        url: '/ticket_purchases/' + id,
        type: 'PUT',
        data: $('#update-ticketpurchase').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
