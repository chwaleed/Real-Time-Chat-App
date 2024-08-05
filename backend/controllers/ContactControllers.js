import User from "../models/UserModel.js";
export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;
    if (!searchTerm) {
      return response.status(400).json({ message: "searchTerm is required." });
    }
    const sanatizeSearchTerm = searchTerm.replace(/[^\w\s]/gi, "");
    const regex = new RegExp(sanatizeSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });
    return response.status(200).json({ contacts });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
