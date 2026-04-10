import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const allComments = await Comment.find({ video: videoId })
        .populate("owner", "username avatar")
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allComments,
                "all comments of video fetched successfully"
            )
        );
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(401, "content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
    });

    const addedComment = await Comment.findById(comment._id).populate("owner", "username avatar");

    if (!addedComment) {
        throw new ApiError(500, "Failed to add comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, addedComment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { newContent } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: newContent,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedComment, "comment updated successfully")
        );
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedComment, "comment deleted successfully")
        );
});

export { getVideoComments, addComment, updateComment, deleteComment };
