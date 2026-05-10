import axios from "axios";

const SHEETY_URL = "https://api.sheety.co/338bc05b3a3e4c553e43f3dc5ca3e8d0/lsmUsers/sheet1";

export const saveToSheet = async (email, password) => {
  console.log("Token being used:", process.env.SHEETY_TOKEN);
  try {
    await axios.post(
      SHEETY_URL,
      {
        sheet1: {
          email,
          password,
          createdAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: process.env.SHEETY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Sheety save successful!");
  } catch (err) {
    console.log("Sheety error:", err.message);
  }
};