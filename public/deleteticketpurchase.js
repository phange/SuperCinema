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

// function deletePeopleCert(pid, cid){
//   $.ajax({
//       url: '/people_certs/pid/' + pid + '/cert/' + cid,
//       type: 'DELETE',
//       success: function(result){
//           if(result.responseText != undefined){
//             alert(result.responseText)
//           }
//           else {
//             window.location.reload(true)
//           } 
//       }
//   })
// };
