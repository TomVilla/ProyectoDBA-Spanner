'use strict';

// sample-metadata:
//  title: CRUD
function randomFlight(maximo)
{
    const {Spanner} = require('@google-cloud/spanner');
    var data = [];
    for (var i = 0; i < maximo; i++ )
    {
        data.push({
            flightid: String(i+1),
            flightsource: String(randomSource()),
            flightdest: String(randomDest()),
            flightdate: String(randomDate()),
        });
    }
    return data;
}
function randomPassenger(maximo)
{
    var data = [];
    for (var i = 0; i < maximo; i++ )
    {
        data.push({
            passid: String(i+1),
            passname: String(randomName()),
            passemail: String(randomEmail()),
            passdob: String(randomDob()),
        });
    }
    return data;
}

function randomBooking(maximo)
{
    var data = [];
    for (var i = 0; i < maximo; i++ )
    {
        data.push({
            bookingid: String(i+1),
            bookdate: String(randomDate()),
            flightid: String(randomNumber(1,1000)),
            seatid: String(randomNumber(1,1000)),
        });
    }
    return data;
}

function randomBookingDetails(maximo){
  var data = [];
  for (var i = 0; i < maximo; i++ )
  {
    data.push({
      bookingid: String(i+1),
      passid: String(randomNumber(1,1000)),
    });
  }
  return data;
}

function randomSeat(maximo){
  const {Spanner} = require('@google-cloud/spanner');

  var data = [];
  for (var i = 0; i < maximo; i++ )
  {
    data.push({
      seatid: String(i+1),
      seatnumber: String(randomNumber(1,10)),
      seatcost: Spanner.float(parseFloat(randomFloat(600,1000).toFixed(2))),
      flightid: String(randomNumber(1,1000)),
    });
  }
  return data;
}

function randomNumber(min, max)
{
    //Para asegurar que no se repitan, se ingresa un rango entre 1 y 2000.
    var numProbabilities = max - min;
    var random = Math.random() * (numProbabilities + 1);
    random = Math.floor(random);
    return random + min;
}
function randomFloat(min, max)
{
    //Para asegurar que no se repitan, se ingresa un rango entre 1 y 2000.
    var numProbabilities = max - min;
    var random = Math.random() * (numProbabilities);
    return random + min;
}
function randomSource()
{
    var choice = new Array("GYE", "UIO", "CUE", "BOG", "SLC", "MIA", "LFD", "TEX", "ROM", "LND", "TKO");
    var random = Math.random() * (choice.length);
    random = Math.floor(random);
    var word = choice[random];
    return word;
}
function randomDest()
{
    var choice = new Array("TRV", "PRV", "MAD", "BAR", "BER");
    var random = Math.random() * (choice.length);
    random = Math.floor(random);
    var word = choice[random];
    return word;
}
function randomDate()
{
    var date = new Date(2022, 0, randomNumber(20,31));
    date = `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`
    return date;
}
function randomName()
{
    var pName = "Usuario ejemplo "
    var expression = Math.random().toString(36).substring(2,10);
    var result = pName + expression;
    return result;
}
function randomEmail()
{
    var expression = Math.random().toString(36).substring(2,10);
    var choice = new Array("correo.com", "gmail.com", "outlook.com", "outlook.es", "yahoo.com");
    var random = Math.random() * (choice.length);
    random = Math.floor(random);
    var word = choice[random];
    var result = expression+"@"+word;
    return result;
}
function randomDob(){
  var date = new Date(randomNumber(1980,2004), randomNumber(0,11), randomNumber(20,31));
  date = `${date.getFullYear()}-${("0"+(date.getMonth()+1)).slice(-2)}-${("0"+date.getDate()).slice(-2)}`
  return date;
}

async function insertData(instanceId, databaseId, projectId) {
  // [START spanner_insert_data]
  // Imports the Google Cloud client library
  const {Spanner} = require('@google-cloud/spanner');
  // Creates a client
  const spanner = new Spanner({
    projectId: projectId,
  });

  // Gets a reference to a Cloud Spanner instance and database
  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);

  // Instantiate Spanner table objects
  const flightsTable = database.table('flight');
  const bookingsTable = database.table('booking');
  const passengersTable = database.table('passenger');
  const bookingdetailsTable = database.table('bookingdetails');
  const seatsTable = database.table('seat');

  // Inserts rows into the Singers table
  // Note: Cloud Spanner interprets Node.js numbers as FLOAT64s, so
  // they must be converted to strings before being inserted as INT64s
  let dataFlights = randomFlight(1000);
  let dataPassengers = randomPassenger(1000);
  let dataBookings = randomBooking(1000);
  let dataBookingDetails = randomBookingDetails(1000);
  let dataSeats = randomSeat(1000);
  try {
    await flightsTable.insert(dataFlights);
    await passengersTable.insert(dataPassengers);
    await seatsTable.insert(dataSeats);
    await bookingsTable.insert(dataBookings);
    await bookingdetailsTable.insert(dataBookingDetails);

    console.log('Inserted data.');
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await database.close();
  }
  // [END spanner_insert_data]
}


require('yargs')
  .demand(1)
  .command(
    'insert <instanceName> <databaseName> <projectId>',
    'Inserts new rows of data into an example Cloud Spanner table.',
    {},
    opts => insertData(opts.instanceName, opts.databaseName, opts.projectId)
  )
  
  .example('node $0 insert "my-instance" "my-database" "my-project-id"')
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/spanner/docs')
  .strict()
  .help().argv;
