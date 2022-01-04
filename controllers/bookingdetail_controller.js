const spanner = require('../spanner.js');
class BookingDetailsController {

    constructor() {
        this.table = spanner.table('bookingdetails');
    }

    async getBookingDetails() {
        const query = {
            sql: 'SELECT * FROM bookingdetails',
        };
        try {
            const [rows] = await spanner.run(query);
            return rows;
        } catch (err) {
            console.error('ERROR:', err);
        }
    }

    async getBookingDetail(id) {
        const query = {
            sql: `SELECT * FROM bookingdetails WHERE bookingid = ${id}`,
        };
        try {
            const [rows] = await spanner.run(query);
            return rows;
        } catch (err) {
            console.error('ERROR:', err);
        }
    }

    async createBookingDetail(bookingdetail) {
        try {
            this.table.insert(bookingdetail);
            return true;
        } catch (err) {
            console.error('ERROR:', err);
        }

    }

    async updateBookingDetail(bookingdetail) {
        try{
            this.table.update(bookingdetail);
            return true;
        }
        catch(err){
            console.error('ERROR:', err);
        }
    }

    async deleteBookingDetail(id) {
        spanner.runTransaction(async (err, transaction) => {
            if (err) {
              console.error(err);
              return;
            }
            try {
              const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM bookingdetails WHERE bookingid = ${id}`,
              });
              console.log(`${rowCount} records deleted from flight.`);
            } catch (err) {
              console.error('ERROR:', err);
            }
            try {
                // The WHERE clause is required for DELETE statements to prevent
                // accidentally deleting all rows in a table.
                // https://cloud.google.com/spanner/docs/dml-syntax#where_clause
                const [rowCount] = await transaction.runUpdate({
                  sql: 'DELETE FROM bookingdetails WHERE true',
                });
                console.log(`${rowCount} records deleted from bookingdetails.`);
                await transaction.commit();
              } catch (err) {
                console.error('ERROR:', err);
              }
        });
    }
}
module.exports = BookingDetailsController;
