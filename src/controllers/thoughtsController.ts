import { Request, Response } from "express";
import { Thought, User } from "../models/index.js";

export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();
    return res.json(thoughts);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getThoughtById = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    return res.json(thought);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createThought = async (req: Request, res: Response) => {
  try {
    const { thoughtText, username, userId } = req.body;
    const newThought = new Thought({
      thoughtText,
      username,
    });

    await newThought.save();
    
    const user = await User.findById(userId);
    if (user) {
      user.thoughts.push(newThought.id);
      await user.save();
    }
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, {new: true});
    if (!thought) {
      return res.status(404).json({ message: "No thought with this id!" });
    }

    return res.json(thought);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.courseId });

    if (!thought) {
      return res.status(404).json({
        message: "No course with that ID",
      });
    }
    return res.json({ message: 'Thought deleted succesfully' })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
