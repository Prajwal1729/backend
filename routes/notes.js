import { Router } from 'express';
import Notes from '../models/Notes.js';
import { body, validationResult } from 'express-validator';
import fetchuser from '../middleware/fetchuser.js';
const router = Router();

// get all the notes using: GET "/api/notes/fetchallnotes". login required //
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    const notes = await Notes.find({user:req.user.id});
    res.json(notes);
});
//----------------------------------------------------------------//

// add new notes using: POST "/api/notes/addnewnotes". login required //
router.post('/addnewnotes',fetchuser,[
    body('title',"Enter a valid title").isLength({min:3}),
    body('description',"Description must be atleast 5 characters").isLength({min:5}),
],async (req,res)=>{ 
try {
    const {title,description,tag} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id
    })

    const saveNote = await note.save();
    res.json(saveNote);
} catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal server error occured.");
}
});

//----------------------------------------------------------------//

export default router;