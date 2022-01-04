const spanner = require('../spanner.js');
class BookingController {

    constructor() {
        this.table = spanner.table('booking');
    }

    async getBookings() {
        const query = {
            sql: 'SELECT * FROM booking',
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
                sql: `DELETE FROM booking WHERE bookingid = ${id}`,
              });
            } catch (err) {
              console.error('ERROR:', err);
            }
          });
    }

    
}
module.exports = BookingController;
