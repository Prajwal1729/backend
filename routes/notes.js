import { Router } from 'express';
// import Notes from '../models/notes.js';
const router = Router();


router.get('/',(req,res)=>{

    res.send("Hello Notes");
})


export default router;