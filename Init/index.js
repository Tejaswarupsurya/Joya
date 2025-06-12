const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");
main()
.then(()=>{
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.log("Database connection failed",err);
});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/joya");
}

const InitDB= async ()=>{
    await Listing.deleteMany({});
    console.log("Database cleared successfully");
    initData.data= initData.data.map((obj)=> ({...obj, owner:"682e27c14e59fe24d5ae58f5"}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized successfully");
};
InitDB();

