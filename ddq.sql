-- Project Group 79

-- Gerry Phan, Colin Kasowski

DROP TABLE IF EXISTS `Customers`;

CREATE TABLE `Customers` (
  `customerID` INT(11) NOT NULL AUTO_INCREMENT,
  `customerName` varchar(255),
  `customerType` varchar(255),
  `customerEmail` varchar(255),
  PRIMARY KEY (`customerID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


LOCK TABLES `Customers` WRITE;

INSERT INTO `Customers` (customerName, customerType, customerEmail)
VALUES 
('Adult', 'jasonbourne@gmail.com'),
('Adult', 'johnwick@gmail.com'),
('Child', 'doratheexplorer@hotmail.com');

UNLOCK TABLES;


DROP TABLE IF EXISTS `Movies`;

CREATE TABLE `Movies` (
  `movieID` INT(11) NOT NULL AUTO_INCREMENT,
  `movieTitle` VARCHAR(255),
  `movieGenre` VARCHAR(255),
  `movieDuration` INT(11),
  `movieRestriction` VARCHAR(255),
  `movieDescription` VARCHAR(255),
  PRIMARY KEY (`movieID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


LOCK TABLES `Movies` WRITE;

INSERT INTO `Movies` (movieTitle, movieGenre, movieDuration, movieRestriction, movieDescription)
VALUES
('Tenet', 'Action', 150, 'Rated R', 'A secret agent embarks on a dangerous, time-bending mission to prevent the start of World War III.'),
('Stowaway', 'Sci Fi', 90, 'Rated R', 'A three-person crew on a mission to Mars faces an impossible choice when an unplanned passenger jeopardizes the lives of everyone on board.'),
('Nobody', 'Action', 90, 'Rated R', 'Emmy winner Bob Odenkirk (Better Call Saul, The Post, Nebraska) stars as Hutch Mansell, an underestimated and overlooked dad and husband, taking lifes indignities on the chin and never pushing back. A nobody. When two thieves break into his suburban home one night, Hutch declines to defend himself or his family, hoping to prevent serious violence. His teenage son, Blake (Gage Munroe, The Shack), is disappointed in him and his wife, Becca (Connie Nielsen, Wonder Woman), seems to pull only further away. The aftermath of the incident strikes a match to Hutchs long-simmering rage, triggering dormant instincts and propelling him on a brutal path that will surface dark secrets and lethal skills. In a barrage of fists, gunfire and squealing tires, Hutch must save his family from a dangerous adversary (famed Russian actor Aleksey Serebryakov, Amazons McMafia) and ensure that he will never be underestimated as a nobody again.');

UNLOCK TABLES;


DROP TABLE IF EXISTS `Showings`;

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


LOCK TABLES `Showings` WRITE;

INSERT INTO `Showings` (movieID, roomID, startTime, endTime, startDate, endDate, capacity)
VALUES
(1,1, '01:00:00', '03:30:00', '2021-05-01', '2021-05-30', 50),
(2,2, '01:00:00', '02:30:00', '2021-05-01', '2021-05-30', 50),
(3,3, '01:00:00', '02:30:00', '2021-05-01', '2021-05-30', 50);

UNLOCK TABLES;


DROP TABLE IF EXISTS `Ticket_Purchases`;

CREATE TABLE `Ticket_Purchases` (
  `customerID` INT(11) NOT NULL, 
  `movieID` INT(11) NOT NULL,  
  `showingID` INT(11) NOT NULL,  
  `roomID` INT(11) NOT NULL,
  `ticketPrice` DECIMAL(10,2),
  PRIMARY KEY (`customerID`, `movieID`),
  FOREIGN KEY (`showingID`) REFERENCES `Showings` (`showingID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;


LOCK TABLES `Ticket_Purchases` WRITE;

INSERT INTO `Ticket_Purchases` (customerID, movieID, showingID, roomID, ticketPrice)
VALUES (1, 1, (select showingID from Showings where movieID=1), 1, 1.00);
INSERT INTO `Ticket_Purchases` (customerID, movieID, showingID, roomID, ticketPrice)
VALUES (2, 2, (select showingID from Showings where movieID=2), 1, 1.00);
INSERT INTO `Ticket_Purchases` (customerID, movieID, showingID, roomID, ticketPrice)
VALUES (3, 3, (select showingID from Showings where movieID=3), 1, 1.00);

UNLOCK TABLES;
