const spanner = require('../spanner.js');
class BookingController {

    constructor() {
        this.table = spanner.table('booking');
    }

    async getBookings() {
        const query = {
            sql: 'SELECT * FROM booking INNER JOIN flight ON booking.flightid = flight.flightid INNER JOIN seat ON booking.seatid = seat.seatid',
        };
        try {
            const [rows] = await spanner.run(query);
            return rows;
        } catch (err) {
            console.error('ERROR:', err);
        }
    }

    async getBooking(id) {
        const query = {
            sql: `SELECT * FROM booking WHERE bookingid = ${id}`,
        };
        try {
            const [rows] = await spanner.run(query);
            return rows;
        } catch (err) {
            console.error('ERROR:', err);
        }
    }

    async createBooking(booking) {
        try {
            this.table.insert(booking);
            return true;
        } catch (err) {
            console.error('ERROR:', err);
        }

    }

    async updateBooking(booking) {
        try{
            this.table.update(booking);
            return true;
        }
        catch(err){
            console.error('ERROR:', err);
        }
    }

    async deleteBooking(id) {
       
        spanner.runTransaction(async (err, transaction) => {
            if (err) {
                console.error(err);
                return;
            }
            try {
                const [rowCount] = await transaction.runUpdate({
                    sql: `DELETE FROM bookingdetails WHERE bookingid=${id}`,
                });
                console.log(`Dato eliminado de booking details.`);
            } catch (err) {
                console.error('ERROR:', err);
            }
            try {
                const [rowCount] = await transaction.runUpdate({
                    sql: `DELETE FROM booking WHERE bookingid=${id}`,
                })
                await transaction.commit();
            } catch (err) {
                console.error('ERROR:', err);
            }
            // if (err) {
            //   console.error(err);
            //   return;
            // }
            // try {
            //   const [rowCount] = await transaction.runUpdate({
            //     sql: `DELETE FROM booking WHERE bookingid = ${id}`,
            //   });
            //   console.log(`${rowCount} records deleted from booking.`);
            // } catch (err) {
            //   console.error('ERROR:', err);
            // }
            // try {
            //     // The WHERE clause is required for DELETE statements to prevent
            //     // accidentally deleting all rows in a table.
            //     // https://cloud.google.com/spanner/docs/dml-syntax#where_clause
            //     const [rowCount] = await transaction.runUpdate({
            //       sql: `DELETE FROM booking WHERE bookingid = ${id}`,
            //     });
            //     console.log(`${rowCount} records deleted from booking.`);
            //     await transaction.commit();
            // } catch (err) {
            //     console.error('ERROR:', err);
            // }
          });

    }

    
}
module.exports = BookingController;
