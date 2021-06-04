module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // helper function for populating homeworld dropdown
    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT planet_id as pid, name FROM bsg_planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }

    // helper function to pull the entire bsg_people db as 'results' which is stored into context.people for access by Handlebars as 'people'
    function getPeople(res, mysql, context, complete){
        mysql.pool.query("SELECT bsg_people.character_id as cid, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    // helper function to populate movies dropdown
    function getMovies(res, mysql, context, complete){
        mysql.pool.query("SELECT movieID, movieTitle, genreID, movieDuration, movieRestriction, movieDescription FROM Movies", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.movies = results;
            complete();
        });
    }    

    function getShowings(res, mysql, context, complete){
        mysql.pool.query("SELECT showingID, movieID, roomID, startTime, endTime, startDate, endDate, capacity FROM Showings", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.showings = results;
            complete();
        });
    }   

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customerID, customerName, customerType, customerEmail FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    // helper function to pull the entire Ticket_Purchases db as 'results' which is stored into context.ticketpurchases for access by Handlebars as 'ticketpurchases'
    // working!
    function getTicketPurchases(res, mysql, context, complete){
        mysql.pool.query("SELECT ticketID as id, customerID, showingID, ticketPrice FROM Ticket_Purchases", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ticketpurchases = results;
            complete();
        });
    }

    // function getPeoplebyHomeworld(req, res, mysql, context, complete){
    //   var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.homeworld = ?";
    //   console.log(req.params)
    //   var inserts = [req.params.homeworld]
    //   mysql.pool.query(query, inserts, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.people = results;
    //         complete();
    //     });
    // }

    /* Find people whose fname starts with a given string in the req */
    // function getPeopleWithNameLike(req, res, mysql, context, complete) {
    //   //sanitize the input as well as include the % character
    //    var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
    //   console.log(query)

    //   mysql.pool.query(query, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.people = results;
    //         complete(); // this func make sure all callbacks finish before we go populate the page
    //     });
    // }

    // not being used
    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT character_id, fname, lname, homeworld, age FROM bsg_people WHERE character_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete(); // this func make sure all callbacks finish before we go populate the page
        });
    }

    function getTicketPurchase(res, mysql, context, id, complete){
        var sql = "SELECT ticketID, customerID, showingID, ticketPrice FROM Ticket_Purchases WHERE ticketID=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ticketpurchase = results[0];
            complete(); // this func make sure all callbacks finish before we go populate the page
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/
    // modified for ticket purchases
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deletemovie.js", "deletecustomer.js", "deleteticketpurchase.js"];  
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);  // if this is removed, entire page does not load!
        getMovies(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        getShowings(res, mysql, context, complete);
        getTicketPurchases(res, mysql, context, complete);
        function complete(){  // this func make sure all callbacks finish before we go populate the page
            callbackCount++;
            if(callbackCount >= 6){  // cant get rid of GetPlanets
                res.render('ticketpurchases', context);
            }

        }
    });

    /*Display all people from a given homeworld. Requires web based javascript to delete users with AJAX*/
    // router.get('/filter/:homeworld', function(req, res){
    //     var callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
    //     var mysql = req.app.get('mysql');
    //     getPeoplebyHomeworld(req,res, mysql, context, complete);
    //     getPlanets(res, mysql, context, complete);
    //     function complete(){
    //         callbackCount++;
    //         if(callbackCount >= 2){
    //             res.render('movies', context);
    //         }

    //     }
    // });


    /* Display one ticketpurchase for the specific purpose of updating ticketpurchase */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateperson.js", "updateticketpurchase.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        getTicketPurchase(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-ticketpurchase', context);
            }

        }
    });
    
    // add ticket purchase
    router.post('/', function(req, res){
        // console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Ticket_Purchases (customerID, showingID, ticketPrice) VALUES (?,?,?)";
        var inserts = [req.body.customerID, req.body.showingID, req.body.ticketPrice];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/ticket_purchases');
            }
        });
    });

    /* The URI that update data is sent to in order to update a ticket purchase */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Ticket_Purchases SET customerID=?, showingID=?, ticketPrice=? WHERE ticketID=?";
        var inserts = [req.body.customerID, req.body.showingID, req.body.ticketPrice, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a ticket purchase, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Ticket_Purchases WHERE ticketID = ?";
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
