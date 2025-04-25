
import mongoose from "mongoose";

const upvotesSchema = mongoose.Schema({
    notes:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"notes"
        },
        pyq:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"pyq",
        },
        solution:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"solution",
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        updatedAt:{
            type:Date,
            default:Date.now
        },
        verified: { type: Boolean, default: false }

})
export const upvotesModel = mongoose.model("upvotes",upvotesSchema)


Router.post('/notes/:id/upvote', mainmiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await notesModel.findById(noteId);

    if (!note) return res.status(404).json({ error: 'Note not found' });

    if (note.upvotes.includes(userId)) {
      return res.status(400).json({ error: 'You have already upvoted this note' });
    }

    note.upvotes.push(userId);
    await note.save();

    res.status(200).json({ message: 'Note upvoted successfully', totalUpvotes: note.upvotes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upvote note', details: err.message });
  }
});