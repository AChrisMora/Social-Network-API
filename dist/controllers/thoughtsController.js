import { Thought, User } from "../models/index.js";
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find();
        return res.json(thoughts);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: "Thought not found" });
        }
        return res.json(thought);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const createThought = async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: thought._id } }, { new: true });
        if (!user) {
            return res.status(404).json({
                message: 'Thought created, but found no user with that ID',
            });
        }
        res.json('Created the thought 🎉');
        return;
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
        return;
    }
};
export const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
        if (!thought) {
            return res.status(404).json({ message: "No thought with this id!" });
        }
        return res.json(thought);
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) {
            return res.status(404).json({
                message: "No course with that ID",
            });
        }
        return res.json({ message: 'Thought deleted succesfully' });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const deleteAllThought = async (_req, res) => {
    try {
        await Thought.deleteMany({});
        return res.json({ message: 'All thoughts deleted succesfully' });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const addThoughtReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
export const removeThoughtReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(thought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
