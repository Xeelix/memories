import mongoose from "mongoose";
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send({ message: 'No post with that id' })
    }


    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send({ message: 'No post with that id' })
        }

        await PostMessage.findByIdAndRemove(id);

        res.json({ message: "Post was deleted" });
    } catch (error) {
        console.log(error.message)
    }
}

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.userId) {
            return res.json({ message: "Unauthenticated" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const post = await PostMessage.findById(id);

        const index = post.likes.findIndex((id) => id === String(req.useId));

        if (index === -1) {
            post.likes.push(req.useId);
        } else {
            post.likes = post.likes.filter(id => id !== String(req.useId))
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.json(updatedPost);
    } catch (error) {
        console.log(error.message)
    }
}
