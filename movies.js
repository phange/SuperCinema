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

    // helper function to pull the entire Movies db as 'results' which is stored into context.movies for access by Handlebars as 'movies'
    function getMovies(res, mysql, context, complete){
        mysql.pool.query("SELECT Movies.movieID as id, movieTitle, movieGenre, movieDuration, movieRestriction, movieDescription FROM Movies", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.movies = results;
            complete();
        });
    }

    function getPeoplebyHomeworld(req, res, mysql, context, complete){
      var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.homeworld = ?";
      console.log(req.params)
      var inserts = [req.params.homeworld]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
    function getPeopleWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)  
      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete(); // this func make sure all callbacks finish before we go populate the page
        });
    }

    /* Find people whose fname starts with a given string in the req */
    function getMovieWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT Movie.movieID as id, movieTitle, movieGenre, movieDuration, movieRestriction, movieDescription FROM Movies WHERE Movies.movieTitle LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)
      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.movies = results;
            complete(); // this func make sure all callbacks finish before we go populate the page
        });
    }

    // helper function for UPDATE person
    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT character_id as id, fname, lname, homeworld, age FROM bsg_people WHERE character_id = ?";
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

    // helper function for UPDATE movie
    function getMovie(res, mysql, context, id, complete){
        var sql = "SELECT movieID as id, movieTitle, movieGenre, movieDuration, movieRestriction, movieDescription FROM Movies WHERE movieID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.movie = results[0];
            complete(); // this func make sure all callbacks finish before we go populate the page
        });
    }    

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deletemovie.js", "deletecustomer.js"];  // added deleteMovie.js
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);  // if this is removed, entire page does not load!
        getMovies(res, mysql, context, complete);
        function complete(){  // this func make sure all callbacks finish before we go populate the page
            callbackCount++;
            if(callbackCount >= 3){  // originally 2. but updated to 3 because i cant get rid of getPlanets
                res.render('movies', context);
            }

        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js","deletemovie.js","searchmovie.js"];
        var mysql = req.app.get('mysql');
        getMovieWithNameLike(req, res, mysql, context, complete);
        getPeopleWithNameLike(req, res, mysql, context, complete);        
        getPlanets(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('movies', context);
            }
        }
    });

    /* Display one movie for the specific purpose of updating movies */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateperson.js", "updatemovie.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete); 
        getPlanets(res, mysql, context, complete);
        getMovie(res, mysql, context, req.params.id, complete); 
        getMovies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('update-movie', context);
            }

        }
    });

    // Insert
    router.post('/', function(req, res){
        // console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Movies (movieTitle, movieGenre, movieDuration, movieRestriction, movieDescription) VALUES (?,?,?,?,?)";
        var inserts = [req.body.movieTitle, req.body.movieGenre, req.body.movieDuration, req.body.movieRestriction, req.body.movieDescription];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/movies');
            }
        });
    });

    /* The URI that update data is sent to in order to update a movie */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Movies SET movieTitle=?, movieGenre=?, movieDuration=?, movieRestriction=?, movieDescription=? WHERE movieID=?";
        var inserts = [req.body.movieTitle, req.body.movieGenre, req.body.movieDuration, req.body.movieRestriction, req.body.movieDescription, req.params.id];
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

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Movies WHERE movieID = ?";
        var inserts = [req.params.id];  // movieID vs. id
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
