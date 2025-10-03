import { Router } from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js'; 
const router = Router();
const JWT_SECRET = "parjwalcode$forinotebook";
// Create a user using post "api/auth/createUser" doesnt require auth

router.post('/createUser',[
    body('name',"Enter a valid name").isLength({min:3}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must be atleast 5 characters").isLength({min:5}),
],async (req,res)=>{
    // if there are error create bad request and return the errors.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // const user = new User(req.body);
    // user.save();
// check wether email exists already.
 try{
     let user = await User.findOne({email: req.body.email});
    // console.log(user);
     if(user){
        return res.status(400).json({error:"Sorry a user with this email already exists"});
     }

     // To create password hash //

     const salt = await bcrypt.genSalt(10);
     const secPass = await bcrypt.hash(req.body.password,salt);

     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
    })

    // Object to be sent in JWT //
    const data = {
        user:{
            id:user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    // console.log(jwt_data);
    //--------------------------------//
    
    // .then(user=>res.json(user))
    // // res.send(req.body);
    // .catch(err=>{console.log(err);
    // res.json({error:"Please enter a unique value for email",message: err.message})});
    //console.log(req.body);
    // res.json(user)
    res.json({authToken});
}
catch(error){
    console.error(error.message);
    res.status(500).send("nternal server error occured.");
}

});


// Authincate a user using: post "api/auth/login" no login required. //

router.post('/login',[
    body('email',"Please enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),

],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
  
    const{email,password} = req.body;

    try {
        let user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }
        const payload = {
            user:{
                id:user.id
            }
        }

        const authTokenLogin = jwt.sign(payload,JWT_SECRET);
        res.json({authTokenLogin});
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured.")
    }

});

//----------------------------------------------------------------//


// get loggedin user details using post "api/auth/getuser" login required //

router.post('/getuser',fetchuser,async (req,res)=>{

try {
    let userId = req.user.id; // get user from jwt token and add id to req object.
    const user = await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error occured.")
    
}
});

//----------------------------------------------------------------//



export default router;