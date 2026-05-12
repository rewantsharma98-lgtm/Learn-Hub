import emailjs from "@emailjs/browser";

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

/**
 * Sends an OTP email to the specified address via EmailJS.
 * @param {string} toEmail  - Recipient email address
 * @param {string} otp      - The 6-digit OTP to include in the email
 * @returns {Promise<void>}
 */
export const sendOtpEmail = async (toEmail, otp) => {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    throw new Error(
      "EmailJS is not configured. Please set VITE_EMAILJS_PUBLIC_KEY, " +
      "VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_TEMPLATE_ID in your .env file."
    );
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: toEmail,
      otp,
    },
    PUBLIC_KEY
  );
};
