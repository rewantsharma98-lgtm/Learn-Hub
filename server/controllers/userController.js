import UserModel from "../model/UserModel.js";

export const getUserData = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};