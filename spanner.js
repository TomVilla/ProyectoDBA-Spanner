
    // [START spanner_update_data]
    // Imports the Google Cloud client library
    const {Spanner} = require('@google-cloud/spanner');

    const projectId = 'dotted-hook-331601';
    const instanceId = 'proyectodb';
    const databaseId = 'aerolinea';
    // Creates a client
    const spanner = new Spanner({
      projectId: projectId,
    });
    // Gets a reference to a Cloud Spanner instance and database
    const instance = spanner.instance(instanceId);
    const database = instance.database(databaseId);
  
  
    
  module.exports = database;
  