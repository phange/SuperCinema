module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGenres(res, mysql, context, complete){
        mysql.pool.query("SELECT genreID, genreName FROM Genres", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.genres  = results; 
            complete();
        });
    }    

    //displays Movies as is
    function getMovies(res, mysql, context, complete){
         mysql.pool.query("SELECT Movies.movieID as id, movieTitle, genreID, movieDuration, movieRestriction, movieDescription FROM Movies", function(error, results, fields){
             if(error){
                res.write(JSON.stringify(error));
                res.end();
             }
             context.movies = results;
             complete();
        });
     } 

    
    // displays Movies with genreID as genreName from Genres instead
    //function getMovies(res, mysql, context, complete){
    //    mysql.pool.query("SELECT Movies.movieID as id, movieTitle, Genres.genreName AS genreID, movieDuration, movieRestriction, movieDescription FROM Movies INNER JOIN Genres ON Movies.genreID = Genres.genreID", function(error, results, fields){
    //        if(error){
    //            res.write(JSON.stringify(error));
    //            res.end();
    //        }
    //        context.movies = results;
    //        complete();
    //    });
    //}

    // displays Movies database with genreID replaced by genreName from Genres.
    function getMoviesByGenre(req, res, mysql, context, complete){
        var query = "SELECT Movies.movieID as id, movieTitle, Genres.genreName AS genreID, movieDuration, movieRestriction, movieDescription FROM Movies INNER JOIN Genres ON Movies.genreID = Genres.genreID WHERE Movies.genreID = ?";
        console.log(req.params)
        var inserts = [req.params.genreID]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.movies = results;
              complete();
          });
      }

    // helper function for UPDATE movie
    function getMovie(res, mysql, context, id, complete){
        var sql = "SELECT movieID as id, movieTitle, genreID, movieDuration, movieRestriction, movieDescription FROM Movies WHERE movieID = ?";
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

    /*Display all movies. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filtergenres.js","deletemovie.js"];  
        var mysql = req.app.get('mysql');
        getMovies(res, mysql, context, complete);
        getGenres(res, mysql, context, complete);
        function complete(){  // this func make sure all callbacks finish before we go populate the page
            callbackCount++;
            if(callbackCount >= 2){ 
                res.render('movies', context);
            }

        }
    });

    /*Display all movies from a specific genre. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:genreID', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filtergenres.js", "deletemovie.js"];
        var mysql = req.app.get('mysql');
        getMoviesByGenre(req,res, mysql, context, complete);
        // getMovies(res, mysql, context, complete);
        getGenres(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('movies', context);
            }

        }
    });

    /* Display one movie for the specific purpose of updating movies */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatemovie.js", "selectedgenre.js"];
        var mysql = req.app.get('mysql');
        getMovie(res, mysql, context, req.params.id, complete); 
        getMovies(res, mysql, context, complete);
        getGenres(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-movie', context);
            }

        }
    });

    // Insert
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        if(req.body.genreID == 0)
        {
            req.body.genreID = null;
        };
        var sql = "INSERT INTO Movies (movieTitle, genreID, movieDuration, movieRestriction, movieDescription) VALUES (?,?,?,?,?)";
        var inserts = [req.body.movieTitle, req.body.genreID, req.body.movieDuration, req.body.movieRestriction, req.body.movieDescription];
        console.log(inserts);
        console.log(JSON.stringify(inserts));
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
        if(req.body.genreID == 0)
        {
            req.body.genreID = null;
        };
        var sql = "UPDATE Movies SET movieTitle=?, genreID=?, movieDuration=?, movieRestriction=?, movieDescription=? WHERE movieID=?";        
        var inserts = [req.body.movieTitle, req.body.genreID, req.body.movieDuration, req.body.movieRestriction, req.body.movieDescription, req.params.id];
        console.log(inserts);
        console.log(JSON.stringify(inserts));
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
