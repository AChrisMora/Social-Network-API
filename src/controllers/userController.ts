import { Request, Response } from "express";
import { User, Thought } from "../models/index.js";

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("thoughts")
      .populate("friends");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    return res.json({ message: "User and thoughts deleted" });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const { friendId } = req.body;
    await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friends: friendId } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: friendId },
      { $addToSet: { friends: userId } },
      { new: true }
    );

    return res.json({ message: "Friend succesfully added YIPEEEE!" });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId
    
    await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: friendId } },
        { new: true }
      );
      await User.findOneAndUpdate(
        { _id: friendId },
        { $pull: { friends: userId } },
        { new: true }
      );

    return res.json({ message: "Friend succesfully removed" });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
