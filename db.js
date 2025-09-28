import { connect } from 'mongoose';
const mongouri = 'mongodb://localhost:27017/';


const connectMongoDB = async() =>{
    // connect(mongouri,()=>{
    //     console.log("MongoDB connected");
    // })
    await connect(mongouri);
    console.log("MongoDB connected successfully!");
}


export default connectMongoDB;