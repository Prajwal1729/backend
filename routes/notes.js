import { Router } from 'express';
import Notes from '../models/Notes.js';
import { body, validationResult } from 'express-validator';
const router = Router();


router.post('/',[
     body('title',"Enter a Valid Title").isLength({min:5}),
     body('description',"Enter a valid description").isLength({min:10}),
     body('tag',"Enter a valid tag").isLength({min:3})
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    Notes.create({
        title:req.body.title,
        description:req.body.description,
        tag:req.body.tag
    }).then(notes=>res.json(notes))
    //  res.send(req.body);
    .catch(err=>{console.log(err);
    res.json({error:"Please enter a unique tag",message: err.message})});
    console.log(req.body)

})


export default router;