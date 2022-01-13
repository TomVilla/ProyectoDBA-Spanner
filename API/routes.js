const express = require("express");
const FlightController = require("./controllers/flight_controller");
const PassengerController = require("./controllers/passenger_controller");
const BookingController = require("./controllers/booking_controller");
const BookingdetailsController = require("./controllers/bookingdetail_controller");
const SeatController = require("./controllers/seat_controller");

const { Spanner } = require("@google-cloud/spanner");
const spanner = require("./spanner.js");
const tableFlight = spanner.table("flight");
const tableSeat = spanner.table("seat");
const tableBooking = spanner.table('booking');

function AerolineaApi(app) {
  const router = express.Router();
  app.use("/", router);
  const flightController = new FlightController();
  router.get("/flights", async function (req, res, next) {
    try {
      const data = await flightController.getFlights();
      res.status(200).json({
        data: data,
        message: "Flights obtenidas con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/flights/:id", async function (req, res, next) {
    try {
      const data = await flightController.getFlight(req.params.id);
      res.status(200).json({
        data: data,
        message: "Flight obtenida con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/flights", async function (req, res, next) {
    try {
      const flight = req.body;
      var d = new Date();
      var timestamp = d.getTime();
      flight.flightid = timestamp;
      await tableFlight.insert([
        {
          flightid: flight.flightid,
          flightsource: flight.flightsource,
          flightdest: flight.flightdest,
          flightdate: flight.flightdate,
        },
      ]);
      await tableSeat.insert([
        {
          seatid: timestamp + 1,
          seatnumber: 1,
          seatcost: Spanner.float(100),
          flightid: timestamp,
        },
        {
          seatid: timestamp + 2,
          seatnumber: 2,
          seatcost: Spanner.float(200),
          flightid: timestamp,
        },
      ]);
      res.status(200).json({
        data: timestamp,
        message: "Flight creada con exito",
      });
    } catch (err) {
      res.status(500).json({
        message: "Flight no creada",
      });
    }
  });

  router.put("/flights/:id", async function (req, res, next) {
    try {
      const data = await flightController.updateFlight(req.params.id, req.body);
      res.status(200).json({
        data: data,
        message: "Flight actualizada con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/flights/:id", async function (req, res, next) {
    try {
      spanner.runTransaction(async (err, transaction) => {
        if (err) {
          console.error(err);
          return;
        }
        const id = req.params.id;
        try {
          try {
            console.log("INIT 1");
            const [rowCount] = await transaction.runUpdate({
              sql: `DELETE FROM seat WHERE flightid=${id}`,
            });
            console.log(`Dato eliminado de seat.` + rowCount);
          } catch (err) {
            console.log("DELETE FLIGHT 1");

            throw new Error(err);
          }
          try {
            console.log("INIT 2");
            const [rowCount] = await transaction.runUpdate({
              sql: `DELETE FROM bookingdetails WHERE bookingid IN (SELECT bookingid FROM booking WHERE flightid=${id})`,
            });
            console.log(`Dato eliminado de bookingdetails.` + rowCount);
          } catch (err) {
            console.log("DELETE FLIGHT 2");
            throw new Error(err);
          }
          try {
            console.log("INIT 3");
            const [rowCount] = await transaction.runUpdate({
              sql: `DELETE FROM booking WHERE flightid=${id}`,
            });
            console.log(`Dato eliminado de booking.` + rowCount);
          } catch (err) {
            console.log("DELETE FLIGHT 3");
            throw new Error(err);
          }
          try {
            console.log("INIT 4");
            const [rowCount] = await transaction.runUpdate({
              sql: `DELETE FROM flight WHERE flightid=${id}`,
            });
            console.log(`Dato eliminado de flight.` + rowCount);
            await transaction.commit();
            res.status(200).json({
              data: rowCount,
              message: "Flight eliminada con exito",
            });
          } catch (err) {
            console.log("DELETE FLIGHT 4");
            throw new Error(err);
          }
        } catch (err) {
          res.status(500).json({
            message: "Flight no eliminada",
          });
        }
      });
      console.log("DELETE FLIGHT 3");
    } catch (error) {
      next(error);
    }
  });

  const passengerController = new PassengerController();
  router.get("/passengers", async function (req, res, next) {
    try {
      const data = await passengerController.getPassengers();
      res.status(200).json({
        data: data,
        message: "Passengers obtenidos con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/passengers/:id", async function (req, res, next) {
    try {
      const data = await passengerController.getPassenger(req.params.id);
      res.status(200).json({
        data: data,
        message: "Passenger obtenido con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/passengers", async function (req, res, next) {
    try {
      const data = await passengerController.createPassenger(req.body);
      res.status(200).json({
        data: data,
        message: "Passenger creado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.put("/passengers/:id", async function (req, res, next) {
    try {
      const data = await passengerController.updatePassenger(
        req.params.id,
        req.body
      );
      res.status(200).json({
        data: data,
        message: "Passenger actualizado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/passengers/:id", async function (req, res, next) {
    try {
      const data = await passengerController.deletePassenger(req.params.id);
      res.status(200).json({
        data: data,
        message: "Passenger eliminado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  const bookingController = new BookingController();
  router.get("/bookings", async function (req, res, next) {
    try {
      const data = await bookingController.getBookings();
      res.status(200).json({
        data: data,
        message: "Bookings obtenidos con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/bookings/:id", async function (req, res, next) {
    try {
      const data = await bookingController.getBooking(req.params.id);
      res.status(200).json({
        data: data,
        message: "Booking obtenido con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/bookings", async function (req, res, next) {
    try {
      const data = await bookingController.createBooking(req.body);
      res.status(200).json({
        data: data,
        message: "Booking creado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.put("/bookings/:id", async function (req, res, next) {
    try {
      const booking = req.body;
      await tableBooking.update([
        {
          bookingid: req.params.id,
          bookdate: booking.bookdate,
          flightid: booking.flightid,
          seatid: booking.seatid,
        },
      ]);

      res.status(200).json({
        data: 1,
        message: "Booking actualizado con exito",
      });
    } catch (error) {
      res.status(500).json({
        message: "Booking no actualizado",
      });
      next(error);
    }
  });
  const detailsController = new BookingdetailsController();

  router.delete("/bookings/:id", async function (req, res, next) {
    try {
      const data = await bookingController.deleteBooking(req.params.id);
      res.status(200).json({
        data: data,
        message: "Booking eliminado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/bookingdetails", async function (req, res, next) {
    try {
      const data = await detailsController.getBookingDetails();
      res.status(200).json({
        data: data,
        message: "Bookingdetails obtenidos con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/bookingdetails/:id", async function (req, res, next) {
    try {
      const data = await detailsController.getBookingdetail(req.params.id);
      res.status(200).json({
        data: data,
        message: "Bookingdetail obtenido con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/bookingdetails", async function (req, res, next) {
    try {
      const data = await detailsController.createBookingdetail(req.body);
      res.status(200).json({
        data: data,
        message: "Bookingdetail creado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  const seatController = new SeatController();
  router.get("/seats", async function (req, res, next) {
    try {
      const data = await seatController.getSeats();
      res.status(200).json({
        data: data,
        message: "Seats obtenidos con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/seats/flight/:id", async function (req, res, next) {
    try {
      const data = await seatController.getSeatsByFlight(req.params.id);
      res.status(200).json({
        data: data,
        message: "Seats obtenidos con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/seats/:id", async function (req, res, next) {
    try {
      const data = await seatController.getSeat(req.params.id);
      res.status(200).json({
        data: data,
        message: "Seat obtenido con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/seats", async function (req, res, next) {
    try {
      const data = await seatController.createSeat(req.body);
      res.status(200).json({
        data: data,
        message: "Seat creado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.put("/seats/:id", async function (req, res, next) {
    try {
      const data = await seatController.updateSeat(req.params.id, req.body);
      res.status(200).json({
        data: data,
        message: "Seat actualizado con exito",
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/seats/:id", async function (req, res, next) {
    try {
      const data = await seatController.deleteSeat(req.params.id);
      res.status(200).json({
        data: data,
        message: "Seat eliminado con exito",
      });
    } catch (error) {
      next(error);
    }
  });
}
module.exports = AerolineaApi;
