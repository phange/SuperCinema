module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    // helper function to pull the entire showings db as 'results' which is stored into context.showings for access by Handlebars as 'showings'
    function getShowings(res, mysql, context, complete){
        mysql.pool.query("SELECT Showings.showingID as id, movieID, roomID, startTime, endTime, startDate, endDate, capacity FROM Showings", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.showings = results;
            complete();
        });
    }

    function getShowing(res, mysql, context, id, complete){
        var sql = "SELECT showingID as id, movieID, roomID, startTime, endTime, startDate, endDate, capacity FROM Showings WHERE showingID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.showing = results[0];
            complete(); // this func make sure all callbacks finish before we go populate the page
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletemovie.js", "deletecustomer.js", "deleteshowing.js"]; 
        var mysql = req.app.get('mysql');
        getMovies(res, mysql, context, complete);
        getShowings(res, mysql, context, complete);
        function complete(){  // this func make sure all callbacks finish before we go populate the page
            callbackCount++;
            if(callbackCount >= 2){  // originally 2. but updated to 4 because i cant get rid of getPlanets
                res.render('showings', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateshowing.js"];
        var mysql = req.app.get('mysql');
        getShowing(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-showing', context);
            }

        }
    });

    // adds showing
    router.post('/', function(req, res){

        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Showings (movieID, roomID, startTime, endTime, startDate, endDate, capacity) VALUES (?,?,?,?,?,?,?)";
        var inserts = [req.body.movieID, req.body.roomID, req.body.startTime, req.body.endTime, req.body.startDate, req.body.endDate, req.body.capacity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/showings');
            }
        });
    });

    /* The URI that update data is sent to in order to update a showing */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Showings SET movieID=?, roomID=?, startTime=?, endTime=?, startDate=?, endDate=?, capacity=? WHERE showingID=?";
        var inserts = [req.body.movieID, req.body.roomID, req.body.startTime, req.body.endTime, req.body.startDate, req.body.endDate, req.body.capacity, req.params.id];
        console.log("req.params.id")
        console.log(JSON.stringify(req.params.id))
        console.log("inserts")
        console.log(JSON.stringify(inserts))
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

    /* Route to delete a showing, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Showings WHERE showingID = ?";
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
