const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// data Base ke liye ham ek async function banaenge 
const MONGO_URL = "mongodb://127.0.0.1:27017/Yatra"

main().then(()=>{
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL); 
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get('/',(req,res) => {
    res.send("Hello");
});

// index route
app.get('/listings', wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//new route
app.get('/listings/new', wrapAsync(async (req,res) => {
    res.render("./listings/new.ejs");
}));


// show route
app.get('/listings/:id', wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}));

// add route

app.post('/listings/', wrapAsync(async (req, res, next) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}));



//Edit Route
app.get('/listings/:id/edit/', wrapAsync(async (req,res) => {
     let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

// Update Route
app.put('/listings/:id', wrapAsync(async (req,res) => {
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// DELETE ROUTE
app.delete('/listings/:id', wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// TEst rouTe
// app.get('/debug', (req, res) => {
//     res.send('Debug route is working');
// });

// app.get('/cause-error', (req, res) => {
//     res.redirect('/:');  // Will intentionally crash with the same error
// });


// app.get('/test',async (req,res) => {
//     let sampleListing = new Listing({
//         title: "travel",
//         description: "abcd",
//         price: 1100,
//         location: "Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Sucessful Testing");
// });

// app.all("*" ,(req, res, next) => {
//      next(new ExpressError(404,"Page Not Found!"));
// });

app.use((err,req,res,next) => {
    let{statusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening at port 8080");
});
