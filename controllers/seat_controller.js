const spanner = require('../spanner.js');
class SeatController{
    constructor(){
        this.table = spanner.table('seat');
    }

    async getSeats(){
        const query = {
            sql: 'SELECT * FROM seat',
        };
        try {
            const [rows] = await spanner.run(query);
            return rows;
        } catch (err) {
            console.error('ERROR:', err);
        }
    }

    async getSeatsByFlight(id){
        const query = {
            sql: `SELECT * FROM seat WHERE flightid = ${id}`,
        };
        try {
            const [rows] = await spanner.run(query);
            return rows;
        } catch (err) {
            console.error('ERROR:', err);
        }
    }

    async getSeat(id){
        const query = {
            sql: `SELECT * FROM seat WHERE seatid = ${id}`,
        };
        try {
            const [rows] = await spanner.run(query);
            return rows;
        } catch (err) {
            console.error('ERROR:', err);
        }
    }

    async createSeat(seat){
        try {
            this.table.insert(seat);
            return true;
        } catch (err) {
            console.error('ERROR:', err);
        }

    }

    async updateSeat(id, seat){
        try{
            this.table.update([{seatid: id, seatnumber: seat.seatnumber, seatcost: seat.seatcost, flightid: seat.flightid}]);
            return true;
        }
        catch(err){
            console.error('ERROR:', err);
        }
    }

    async deleteSeat(id){
        spanner.runTransaction(async (err, transaction) => {
            if (err) {
              console.error(err);
              return;
            }
            try {
              const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM seat WHERE seatid = ${id}`,
              });
            } catch (err) {
              console.error('ERROR:', err);
            }
          });
    }
}

module.exports = SeatController;