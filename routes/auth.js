import { Router } from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
const router = Router();



// Create a user using post "api/auth/" doesnt require auth

router.post('/',[
    body('name',"Enter a valid name").isLength({min:3}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must be atleast 5 characters").isLength({min:5}),
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // const user = new User(req.body);
    // user.save();
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user=>res.json(user))
    // res.send(req.body);
    .catch(err=>{console.log(err);
    res.json({error:"Please enter a unique value for email",message: err.message})});
    //  console.log(req.body);

});



export default router;