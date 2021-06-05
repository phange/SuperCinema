-- Project Group 79

-- Gerry Phan, Colin Kasowski

-- : = variable


-- Genres PAge
SELECT genreID, genreName from Genres;

INSERT INTO Genres (genreName) VALUES (:genreName);

UPDATE Genres SET
    genreName = :genreName
;

-- Movies Page

-- displays Movies as is
SELECT Movies.movieID as id, movieTitle, genreID, movieDuration, movieRestriction, movieDescription FROM Movies;
-- displays Movies table with genreID replaced with corresponding genreName from Genres
SELECT Movies.movieID as id, movieTitle, Genres.genreName AS genreID, movieDuration, movieRestriction, movieDescription FROM Movies INNER JOIN Genres ON Movies.genreID = Genres.genreID;
-- displays Movies table with genreID replaced with corresponding genreName from Genres
-- AND matching Genre from filter dropdown
SELECT Movies.movieID as id, movieTitle, Genres.genreName AS genreID, movieDuration, movieRestriction, movieDescription FROM Movies INNER JOIN Genres ON Movies.genreID = Genres.genreID WHERE Movies.genreID = ?;

-- basic insert
INSERT INTO Movies (movieTitle, genreID, movieDuration, movieRestriction, movieDescription)
VALUES (:movieTitle, :genreID, :movieDuration, :movieRestriction, :movieDescription);

-- basic update
UPDATE Movies SET 
    movieTitle = :movieTitle,
    genreID = :genreID,
    movieRestriction = :movieRestriction,
    movieDescription = :movieDescription
    WHERE movieID = :movieID
;

DELETE FROM Movies WHERE movieID = :movieID;


-- Customers Page

SELECT * FROM Customers;

INSERT INTO Customers (customerType, customerEmail)
VALUES (:customerType, :customerEmail);

UPDATE Customers SET
    customerType = :customerType,
    customerEmail = :customerEmail
    WHERE customerID = :customerID
;

DELETE FROM Customers WHERE customerID = :customerID;


-- Showings Page

SELECT * FROM Showings;

INSERT INTO Showings (movieID, roomID, startTime, endTime, startDate, endDate, capacity)
VALUES (:movieID, :roomID, :startTime, :endTime :startDate, :endDate, :capacity);

UPDATE Showings SET 
    movieID = :movieID,
    roomID = :roomID,
    startTime = :startTime,
    endTime = :endTime,
    startDate = :startDate,
    endDate = :endDate
;

DELETE FROM Showings WHERE showingID = :showingID;

-- Ticket Purchases Page

SELECT * FROM Ticket_Purchases;

INSERT INTO Ticket_Purchases (customerID, movieID, showingID, roomID, ticketPrice)
VALUES (:customerID, :movieID, :showingID, :roomID, :ticketPrice);

UPDATE Ticket_Purchases SET
    customerID = :customerID,
    movieID = :movieID,
    showingID = :showingID,
    roomID = :roomID,
    ticketPrice = :ticketPrice
;

DELETE FROM Ticket_Purchases WHERE showingID = :showingID; 






