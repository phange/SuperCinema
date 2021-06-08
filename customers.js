module.exports = function(){
    var express = require('express');
    var router = express.Router();


    // helper function to pull the entire Customers db as 'results' which is stored into context.customers for access by Handlebars as 'customers'
    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT Customers.customerID as id, customerName, customerType, customerEmail FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT customerID as id, customerName, customerType, customerEmail FROM Customers WHERE customerID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete(); // this func make sure all callbacks finish before we go populate the page
        });
    }

    /*Display all customers. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletemovie.js", "deletecustomer.js"];  // added deleteMovie.js, not tested
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete(){  // this func make sure all callbacks finish before we go populate the page
            callbackCount++;
            if(callbackCount >= 1){ 
                res.render('customers', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating customer */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-customer', context);
            }

        }
    });
    
    /* Adds a customer, redirects to the customers page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("req.body from post add form")
        console.log(req.body)
        var sql = "INSERT INTO Customers (customerName, customerType, customerEmail) VALUES (?,?,?)";
        var inserts = [req.body.customerName, req.body.customerType, req.body.customerEmail];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log("Sucessfully added new customer!")
                res.redirect('/customers');
            }
        });
    });

    /* The URI that update data is sent to in order to update a customer */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Customers SET customerName=?, customerType=?, customerEmail=? WHERE customerID=?";
        var inserts = [req.body.customerName, req.body.customerType, req.body.customerEmail, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log("Successfully updated customer!")
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE customerID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();