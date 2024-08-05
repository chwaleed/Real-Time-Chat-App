import User from "../models/UserModel.js";
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
