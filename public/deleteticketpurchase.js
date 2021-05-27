// test file modeled after deletepeople.js

function deleteTicketPurchase(id){
    $.ajax({
        url: '/ticketpurchases/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
