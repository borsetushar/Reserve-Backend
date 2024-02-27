require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Trip = require('./models/trips');
const Booking = require('./models/bookings');
const district = require('./models/district');
const MongoClient = require('mongodb').MongoClient;

const stripe = require("stripe")("sk_test_51OjvHNSEbHtNOk0niqRWBV0ok84VzqMxLk1WCK0VZm2YF3pejabHiBqwWFQv27SAIqlGJUKrx3zP0zDM18RybCtE00XXnDngt6");


const app = express();
const port = process.env.PORT || 5000;

//connection to mongoDb using mongoose
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connected to MongoDB', process.env.MONGODB_URI);
})
.catch((error)=>{
    console.error('Error Connecting to mongoDB:', error);
});

app.use(express.json());
app.use(cors());



//routes
app.get('/',(req,res)=>{
  res.send("Hello, this is your Node.js Server!");
});





//Route to handle adding a new trip
app.post('/api/trips', async(req,res)=>{
  try{
      const newTrip = req.body;
      const savedTrip = await Trip.create(newTrip)
      
      console.log('Added Trip:', savedTrip);
      res.status(201).json({ message: 'Trip added successfully', trip : savedTrip });
  }catch(error){
      console.log('Error Adding a new trip:', error);
      res.status(500).json({error: 'Internal Server Error'});
  }
});




//route to retrive the past trips
app.get('/api/past-trips', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();

    // Specify the collection
    const collection = db.collection('trips');

    // Fetch past trips with a limit of 50 results
    const pastTrips = await collection.find().limit(50).toArray();

    // Close the MongoDB connection
    client.close();

    // Send the response with past trips data
    res.status(200).json({pastTrips});
  } catch (error) {
    console.error('Error fetching past trips:', error);
    res.status(500).send('Internal Server Error');
  }
});



//route for saving ticket booking details
app.post('/api/bookings', async(req,res)=>{
  try{
      //extracting booking details from req parameters
      const {userName, busName, seatNumber,date} = req.body;

      //creating a new booking instance
      const newBooking = new Booking({
          userName,
          busName,
          seatNumber,
          date
      });
      //saving to the database
      const savedBooking = await newBooking.save();
      res.status(201).json({message: 'Booking saved Successfully',Booking: savedBooking})
  } catch(error){
      console.error('Error saving booking:', error);
      res.status(500).json({error: 'Internal Server Error'});
  }
});




// GET endpoint for retrieving trip details based on date
app.get('/api/trip/date', async (req, res)=>{
  try{
      
      const {date} = req.query;
      console.log({date})
      let query = {} 
      if(date){
          query.date = date
      }
      const data = await Trip.find(query)
         console.log({data})
      return res.json({data})

  }
  catch (err){
      res.status(500).json({ error: 'Internal Server Error' });
  }
})



// GET endpoint for retrieving trip details based on query
app.get('/api/trip', async (req, res) => {
  try {
      const { from, to, busOwnerID, startTime, endTime, category, seatBooked, bus_no, amenities_list, busFare, busName } = req.query;

      // Build the query object based on provided parameters
      let query = {};
      
      if (from) query.from = from;
      if (to) query.to = to;
      if (busOwnerID) query.busOwnerID = busOwnerID;
      if (startTime) query.startTime = startTime;
      if (endTime) query.endTime = endTime;
      if (category) query.category = category;
      if (seatBooked) query.seatBooked = seatBooked;
      if (bus_no) query.bus_no = bus_no;
      if (amenities_list) query.amenities_list = amenities_list;
      if (busFare) query.busFare = busFare;
      if (busName) query.busName = busName;

      console.log('Category:', category);
      const data = await Trip.find(query);
      //console.log({ data });
      return res.json({ data });
  } catch (err) {
      console.error('Error retrieving trip details:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//route for getting districts data
app.get('/api/districts', async (req, res) => {
  try {
      // Connect to MongoDB
      const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db();

      // Specify the collection
      const collection = db.collection('state_disrict');
      
      // Fetch districts from the collection and convert cursor to array
      const districtsCursor = await collection.find();
      const districts = await districtsCursor.toArray();

      // Close the MongoDB connection
      client.close();

      // Send the response with districts data
      res.status(200).json({ districts });
  } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//API for Stripe payment gateaway
app.post("/api/create-checkout-session", async (req, res) => {
const { products } = req.body;
console.log(products);

const lineItems = [{
    price_data: {
        currency: "inr",
        product_data: {
            name: "bus",
        },
        unit_amount: products * 100, // Assuming products is the price in the smallest currency unit (e.g., cents)
    },
    quantity: 1
}];

try {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/reserve-app/success",
        cancel_url: "http://localhost:3000/reserve-app/cancel",
        shipping_address_collection: {
            allowed_countries: ['US'],
        },
    });

    res.json({ id: session.id });
} catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
}
});



//starting the server
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
