import User from "../models/UserModel.js";
import Message from "../models/messagesModel.js";
import mongoose from "mongoose";

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;
    if (!searchTerm) {
      return response.status(400).json({ message: "searchTerm is required." });
    }
    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}|[\]\\]/g, "\\$&");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } }, // Assuming request.userId is correctly obtained
        {
          $or: [
            { firstName: { $regex: sanitizedSearchTerm, $options: "i" } },
            { lastName: { $regex: sanitizedSearchTerm, $options: "i" } },
            { email: { $regex: sanitizedSearchTerm, $options: "i" } },
          ],
        },
      ],
    });
    return response.status(200).json({ contacts });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContactsForDMList = async (request, response, next) => {
  try {
    let { userId } = request;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
