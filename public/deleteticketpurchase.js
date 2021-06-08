// test file modeled after deletepeople.js

function deleteTicketPurchase(id){
    $.ajax({
        url: '/ticket_purchases/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
