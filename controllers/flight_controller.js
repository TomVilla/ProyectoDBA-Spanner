const spanner = require('../spanner.js');
class FlightController {

    constructor() {
        this.table = spanner.table('flight');
    }
    
    async getFlights() {
        const query = {
            sql: 'SELECT * FROM flight',
          };
          try {
            const [rows] = await spanner.run(query);
            return rows;
          } catch (err) {
            console.error('ERROR:', err);
          }
    }

    async getFlight(id) {
        const query = {
            sql: `SELECT * FROM flight WHERE flightid = ${id}`,
          };
          try {
            const [rows] = await spanner.run(query);
            return rows;
          } catch (err) {
            console.error('ERROR:', err);
          }
    }

    async createFlight(flight) {
        
        try {
            this.table.insert(flight);
            return true;
        } catch (err) {
            console.error('ERROR:', err);
        }

    }

    async updateFlight(flight) {
        try{
            this.table.update(flight);
            return true;
        }
        catch(err){
            console.error('ERROR:', err);
        }
    }

    async deleteFlight(id) {
        spanner.runTransaction(async (err, transaction) => {
          if (err) {
            console.error(err);
            return;
          }
          try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM flight WHERE flightid=${id}`,
            });
            console.log(`Dato eliminado de fligth.`);
          } catch (err) {
            console.error('ERROR:', err);
          }
          try {
            const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM booking WHERE flightgid=${id}`,
            })
            await transaction.commit();
          } catch (err) {
            console.error('ERROR:', err);
          }
        });
    }


}

module.exports = FlightController;
