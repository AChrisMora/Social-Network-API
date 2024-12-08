import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId)
        .populate('thoughts')
        .populate('friends');
        if (!user) {
         res.status(404).json({ message: 'User not found'});
        }
        res.json(user);
    } catch (err: any) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        return res.json(user);
    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Thought.deleteMany({ _id: { $in: user.thoughts } })
        return res.json({ message: 'User and thoughts deleted' });
    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        });
    }
}

export const addFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId);
        const friend = await User.findById(req.params.friendId);
        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }

        user.friends.push(friend.id);
        friend.friends.push(user.id);

        await user.save();
        await friend.save();

        return res.json({ mesage: 'Friend succesfully added YIPEEEE!'})
    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        });
    }
}


export const removeFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId);
        const friend = await User.findById(req.params.friendId);
        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }

        user.friends = user.friends.filter(f => f.toString() !== friend.id.toString());
        friend.friends = friend.friends.filter(f => f.toString() !== user.id.toString());
        
        await user.save();
        await friend.save();

        return res.json({ message: 'Friend succesfully removed' });
    } catch (err: any) {
        return res.status(500).json({
            message: err.message
        });
    }
}
