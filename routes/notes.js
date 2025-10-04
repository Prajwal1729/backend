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

// update existing the notes using: PUT "/api/notes/updatenotes/:id". login required //

router.put('/updatenotes/:id',fetchuser,
    [
        body('title',"Enter a valid title").isLength({min:3}),
        body('description',"Description must be atleast 5 characters").isLength({min:5}),
    ],async (req,res)=>{
        try {
            const{title,description,tag} = req.body;
            const newNote = {};
            if(title){
                newNote.title = title;
                newNote.description = description;
                newNote.tag = tag;
        }
        // find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }

        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Unauthorized access");
        }

        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json({note});
        } 
        catch (error) {
            console.error(error.message);
            return res.status(500).send("Internal server error occured.");
        }
});

//----------------------------------------------------------------//

// delete existing the notes using: DELETE "/api/notes/deletenotes/:id". login required //
router.delete('/deletenotes/:id',fetchuser,async(req,res)=>{
    // const {title,description,tag} = req.body;
    try {
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }

        // allow deletion only if user owns this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Unauthorized access");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted Successfully",note:note});
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error occured.");
    }
});


//---------------------------------------------------------------//

export default router;