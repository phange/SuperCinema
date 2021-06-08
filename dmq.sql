-- Project Group 79

-- Gerry Phan, Colin Kasowski

-- : = variable


-- Genres Page ------------------------------------------------------------------------------------------------------------------------------------------------
-- displays Genres as is
SELECT genreID, genreName from Genres;

-- Basic insert for Genres table
INSERT INTO Genres (genreName) VALUES (:genreName);

-- Basic update for Genres table
UPDATE Genres SET
    genreName = :genreName

-- Delete from Genres table based on genreID
DELETE FROM Genres WHERE genreID = ?
;

-- Movies Page ------------------------------------------------------------------------------------------------------------------------------------------------

-- displays Movies as is
SELECT Movies.movieID as id, movieTitle, genreID, movieDuration, movieRestriction, movieDescription FROM Movies;
-- displays Movies table with genreID replaced with corresponding genreName from Genres
SELECT Movies.movieID as id, movieTitle, Genres.genreName AS genreID, movieDuration, movieRestriction, movieDescription FROM Movies INNER JOIN Genres ON Movies.genreID = Genres.genreID;
-- displays Movies table with genreID replaced with corresponding genreName from Genres
-- AND matching Genre from filter dropdown
SELECT Movies.movieID as id, movieTitle, Genres.genreName AS genreID, movieDuration, movieRestriction, movieDescription FROM Movies INNER JOIN Genres ON Movies.genreID = Genres.genreID WHERE Movies.genreID = ?;

-- Basic insert
INSERT INTO Movies (movieTitle, genreID, movieDuration, movieRestriction, movieDescription)
VALUES (:movieTitle, :genreID, :movieDuration, :movieRestriction, :movieDescription);

-- basic update based on movieID
UPDATE Movies SET 
    movieTitle = :movieTitle,
    genreID = :genreID,
    movieRestriction = :movieRestriction,
    movieDescription = :movieDescription
    WHERE movieID = :movieID
;

-- Delete from movies table based on movieID
DELETE FROM Movies WHERE movieID = :movieID;


-- Customers Page ---------------------------------------------------------------------------------------------------------------------------------------------

-- Display Customers as is
SELECT * FROM Customers;

-- Basic insert to Customers table
INSERT INTO Customers (customerType, customerEmail)
VALUES (:customerType, :customerEmail);

-- Basic update to Customers table based on customerID
UPDATE Customers SET
    customerType = :customerType,
    customerEmail = :customerEmail
    WHERE customerID = :customerID
;

-- Delete from Customers table based on customerID
DELETE FROM Customers WHERE customerID = :customerID;  


-- Showings Page ----------------------------------------------------------------------------------------------------------------------------------------------

-- Display Showings as is
SELECT * FROM Showings;

-- Basic insert to Showings table
INSERT INTO Showings (movieID, roomID, startTime, endTime, startDate, endDate, capacity)
VALUES (:movieID, :roomID, :startTime, :endTime :startDate, :endDate, :capacity);

-- Basic update to showings table
UPDATE Showings SET 
    movieID = :movieID,
    roomID = :roomID,
    startTime = :startTime,
    endTime = :endTime,
    startDate = :startDate,
    endDate = :endDate
;

-- Delete from Showings table based on showingID
DELETE FROM Showings WHERE showingID = :showingID;

-- Ticket Purchases Page --------------------------------------------------------------------------------------------------------------------------------------

-- Display Ticket_Purchases table as is
SELECT * FROM Ticket_Purchases;

-- Basic insert into Ticket_Purchases table
INSERT INTO Ticket_Purchases (customerID, movieID, showingID, roomID, ticketPrice)
VALUES (:customerID, :movieID, :showingID, :roomID, :ticketPrice);

-- Basic update to Ticket_Purchases
UPDATE Ticket_Purchases SET
    customerID = :customerID,
    movieID = :movieID,
    showingID = :showingID,
    roomID = :roomID,
    ticketPrice = :ticketPrice
;

-- Delete from Ticket_Purchases based on showingID
DELETE FROM Ticket_Purchases WHERE showingID = :showingID; 






