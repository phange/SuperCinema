-- Project Group 79

-- Gerry Phan, Colin Kasowski


 -- Customers Page --
DROP TABLE IF EXISTS `Customers`;

-- Variable setup for Customers table
CREATE TABLE `Customers` (
  `customerID` INT(11) NOT NULL AUTO_INCREMENT,
  `customerName` varchar(255),
  `customerType` varchar(255),
  `customerEmail` varchar(255),
  PRIMARY KEY (`customerID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Insert values
INSERT INTO `Customers` (customerName, customerType, customerEmail)
VALUES 
('Jason Bourne','Adult', 'jasonbourne@gmail.com'),
('Jonathan Wick','Adult', 'johnwick@gmail.com'),
('Dora Johnson','Child', 'doratheexplorer@hotmail.com');


-- Movies Page --
DROP TABLE IF EXISTS `Movies`;

-- Variable setup for Movies table
CREATE TABLE `Movies` (
  `movieID` INT(11) NOT NULL AUTO_INCREMENT,
  `movieTitle` VARCHAR(255),
  `genreID` INT(11) DEFAULT NULL,
  `movieDuration` INT(11),
  `movieRestriction` VARCHAR(255),
  `movieDescription` VARCHAR(255),
  PRIMARY KEY (`movieID`),
  FOREIGN KEY (`genreID`) REFERENCES `Genres` (`genreID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Insert values
INSERT INTO `Movies` (movieTitle, genreID, movieDuration, movieRestriction, movieDescription)
VALUES
('Tenet', 23, 150, 'Rated R', 'A secret agent embarks on a dangerous, time-bending mission to prevent the start of World War III.'),
('Stowaway', 25, 90, 'Rated R', 'A three-person crew on a mission to Mars faces an impossible choice when an unplanned passenger jeopardizes the lives of everyone on board.'),
('Nobody', 23, 90, 'Rated R', 'Emmy winner Bob Odenkirk (Better Call Saul, The Post, Nebraska) stars as Hutch Mansell, an underestimated and overlooked dad and husband, taking lifes indignities on the chin and never pushing back. A nobody. When two thieves break into his suburban home one night, Hutch declines to defend himself or his family, hoping to prevent serious violence. His teenage son, Blake (Gage Munroe, The Shack), is disappointed in him and his wife, Becca (Connie Nielsen, Wonder Woman), seems to pull only further away. The aftermath of the incident strikes a match to Hutchs long-simmering rage, triggering dormant instincts and propelling him on a brutal path that will surface dark secrets and lethal skills. In a barrage of fists, gunfire and squealing tires, Hutch must save his family from a dangerous adversary (famed Russian actor Aleksey Serebryakov, Amazons McMafia) and ensure that he will never be underestimated as a nobody again.');


-- Showings Page --
DROP TABLE IF EXISTS `Showings`;

-- Variable setup for Showings table
CREATE TABLE `Showings` (
  `showingID` INT(11) NOT NULL AUTO_INCREMENT,
  `movieID` INT(11) NOT NULL,
  `roomID` INT(11) NOT NULL,
  `startTime` TIME,
  `endTime` TIME,
  `startDate` DATE,
  `endDate` DATE,
  `capacity` INT(2) default 50,
  PRIMARY KEY (`showingID`),
  FOREIGN KEY (`movieID`) REFERENCES `Movies` (`movieID`)
  
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=latin1;

-- Insert values
INSERT INTO `Showings` (movieID, roomID, startTime, endTime, startDate, endDate, capacity)
VALUES
(1,1, '01:00:00', '03:30:00', '2021-05-01', '2021-05-30', 50),
(2,2, '01:00:00', '02:30:00', '2021-05-01', '2021-05-30', 50),
(3,3, '01:00:00', '02:30:00', '2021-05-01', '2021-05-30', 50);

-- Ticket_Purchases Page --
DROP TABLE IF EXISTS `Ticket_Purchases`;

-- Variable setup for Ticket_Purchases table
CREATE TABLE `Ticket_Purchases` (
  `ticketID` INT(11) NOT NULL AUTO_INCREMENT,
  `customerID` INT(11) NOT NULL, 
  `showingID` INT(11) NOT NULL,  
  `ticketPrice` DECIMAL(10,2),
  PRIMARY KEY (`ticketID`),
  FOREIGN KEY (`showingID`) REFERENCES `Showings` (`showingID`), 
  FOREIGN KEY (`customerID`) REFERENCES `Customers` (`customerID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

-- Insert values
INSERT INTO `Ticket_Purchases` (customerID, showingID, ticketPrice)
VALUES (5, 162, 20.00);
INSERT INTO `Ticket_Purchases` (customerID, showingID, ticketPrice)
VALUES (6, 163, 20.00);
INSERT INTO `Ticket_Purchases` (customerID, showingID, ticketPrice)
VALUES (7, 164, 20.00);

-- Genres Page --
DROP TABLE IF EXISTS `Genres`;

-- Variable setup for Genres table
CREATE TABLE `Genres` (
  `genreID` INT(11) not null AUTO_INCREMENT,
  `genreName` VARCHAR(255) not null,
  PRIMARY KEY (`genreID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

-- Insert values
INSERT INTO `Genres` (genreName)
VALUES ('Action');
INSERT INTO `Genres` (genreName)
VALUES ('Horror');
INSERT INTO `Genres` (genreName)
VALUES ('Drama');
INSERT INTO `Genres` (genreName)
VALUES ('Romance');
INSERT INTO `Genres` (genreName)
VALUES ('Comedy');
INSERT INTO `Genres` (genreName)
VALUES ('Science Fiction');



