const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../models/listing.js");

main()
.then(() => {
    console.log("connected to db")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlist');
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner : "694b8f4582831c0cc9ee5b90"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();

