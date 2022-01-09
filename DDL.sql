CREATE TABLE booking (
  bookingid INT64 NOT NULL,
  bookdate DATE,
  flightid INT64 NOT NULL,
  seatid INT64 NOT NULL
) PRIMARY KEY(bookingid);

CREATE TABLE bookingdetails (
  bookingid INT64 NOT NULL,
  passid INT64 NOT NULL,
) PRIMARY KEY(bookingid, passid);

ALTER TABLE bookingdetails ADD FOREIGN KEY(bookingid) REFERENCES booking(bookingid);

CREATE TABLE flight (
  flightid INT64 NOT NULL,
  flightsource STRING(1024),
  flightdest STRING(1024),
  flightdate DATE
) PRIMARY KEY(flightid);

ALTER TABLE booking ADD FOREIGN KEY(flightid) REFERENCES flight(flightid);

CREATE TABLE passenger (
  passid INT64 NOT NULL,
  passname STRING(1024),
  passemail STRING(1024),
  passdob DATE,
) PRIMARY KEY(passid);

ALTER TABLE bookingdetails ADD FOREIGN KEY(passid) REFERENCES passenger(passid);

CREATE TABLE seat (
    seatid INT64 NOT NULL,
    seatnumber INT64 NOT NULL,
    seatcost    FLOAT64 NOT NULL,
    flightid INT64 NOT NULL
)   PRIMARY KEY(seatid);

ALTER TABLE seat ADD FOREIGN KEY(flightid) REFERENCES flight(flightid);
ALTER TABLE booking ADD FOREIGN KEY(seatid) REFERENCES seat(seatid);
