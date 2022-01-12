const spanner = require('../spanner.js');
class PassengerController {

    constructor() {
        this.table = spanner.table('passenger');
    }

    async getPassengers() {
        const query = {
            sql: 'SELECT * FROM passenger',
          };
          try {
            const [rows] = await spanner.run(query);
            return rows;
          } catch (err) {
            console.error('ERROR:', err);
          } 
    }

    async getPassenger(id) {
        const query = {
            sql: `SELECT * FROM passenger WHERE passid = ${id}`,
          };
          try {
            const [rows] = await spanner.run(query);
            return rows;
          } catch (err) {
            console.error('ERROR:', err);
          }
    }

    async createPassenger(passenger) {
        try {
            await this.table.insert(passenger);
            return true;
        } catch (err) {
            console.error('ERROR:', err);
        }

    }

    async updatePassenger(id, passenger) {
        try{
            await this.table.update([{passid: id, passname: passenger.passname, passemail: passenger.passemail, passdob: passenger.passdob}]);
            return true;
        }
        catch(err){
            console.error('ERROR:', err);
        }
    }

    async deletePassenger(id) {
        spanner.runTransaction(async (err, transaction) => {
            if (err) {
              console.error(err);
              return;
            }
            try {
              const [rowCount] = await transaction.runUpdate({
                sql: `DELETE FROM passenger WHERE passid = ${id}`,
              });
            } catch (err) {
              console.error('ERROR:', err);
            }
          });
    }

}

module.exports = PassengerController;
