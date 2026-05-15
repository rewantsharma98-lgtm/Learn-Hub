import express from "express";

import multer from "multer";

import fs from "fs";

import {
    PutObjectCommand
} from "@aws-sdk/client-s3";

import { s3 } from "../config/r2.js";
import Media from "../model/Media.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

const upload = multer({
    dest: "uploads/",
});

router.post(
    "/upload",
    adminAuth,
    upload.single("media"),
    async (req, res) => {

        try {

            const file = req.file;

            if (!file) {

                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }

            // Upload to Cloudflare R2
            await s3.send(

                new PutObjectCommand({

                    Bucket:
                        process.env.R2_BUCKET,

                    Key:
                        `${Date.now()}-${file.originalname}`,

                    Body:
                        fs.createReadStream(
                            file.path
                        ),

                    ContentType:
                        file.mimetype,
                })
            );

            // Public URL
            const fileUrl =
                `${process.env.R2_PUBLIC_URL}/${Date.now()}-${file.originalname}`;

            // Save metadata to MongoDB
            await Media.create({

                fileName:
                    file.originalname,

                url: fileUrl,

                type: file.mimetype,

                size: file.size,
            });

            // Delete local temp file
            fs.unlinkSync(file.path);

            res.json({

                success: true,

                url: fileUrl,
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({

                success: false,

                error: err.message,
            });
        }
    }
);

export default router;