import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/notes/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|docx|zip|txt/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extName) {
      return cb(null, true);
    } else {
      cb("Error: Only PDF, DOCX, ZIP or TXT files are allowed!");
    }
  },
});

export default upload;
