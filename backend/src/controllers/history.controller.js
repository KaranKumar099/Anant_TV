import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const addToHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    // Check if already exists in history
    const existingIndex = user.watchHistory.findIndex(
        (h) => h.video._id.toString() === videoId
    );
    if (existingIndex !== -1) {
        user.watchHistory = user.watchHistory.filter(
            (item) => item !== user.watchHistory.at(existingIndex)
        );
    }
    user.watchHistory.push({ video: videoId });

    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                user.watchHistory,
                "video added to watchHistory successfully"
            )
        );
});

// Get watch history
const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId)
        .populate("watchHistory.video", "title thumbnail duration owner") // populate video details
        .select("watchHistory")
        .populate({
            path: "watchHistory.video",
            populate: {
                path: "owner",
                select: "avatar username",
            },
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                user.watchHistory,
                "fetched user watchHistory successfully"
            )
        );
});

// Remove single video from history
const removeFromHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
        $pull: { watchHistory: { video: videoId } },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                {},
                "video removed from watchHistory successfully"
            )
        );
});

// Clear history
const clearHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { $set: { watchHistory: [] } });

    return res
        .status(200)
        .json(new ApiResponse(201, {}, "cleared history successfully"));
});

export { getHistory, addToHistory, removeFromHistory, clearHistory };
