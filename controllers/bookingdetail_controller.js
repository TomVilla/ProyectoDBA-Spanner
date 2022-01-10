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

}
module.exports = BookingDetailsController;
