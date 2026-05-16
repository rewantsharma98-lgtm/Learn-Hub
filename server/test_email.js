import dotenv from "dotenv";
dotenv.config();
import emailjs from '@emailjs/nodejs';

const testEmail = async () => {
    const toEmail = "rewantsharma56@gmail.com";
    const otp = "123456";
    
    try {
        console.log(`Attempting to send EmailJS using SDK to: ${toEmail}`);
        console.log("Keys:", {
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY?.substring(0, 4) + "...",
            serviceID: process.env.EMAILJS_SERVICE_ID
        });

        const result = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                to_email: toEmail,
                otp: otp
            },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
        );
        console.log("EmailJS SDK Success:", result);
    } catch (error) {
        console.error("EmailJS SDK Error:", error);
    }
};

testEmail();
