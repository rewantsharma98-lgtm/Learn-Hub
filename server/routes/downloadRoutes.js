import express from 'express';
import { logDownload } from '../controllers/downloadController.js';
import userAuth from '../middleware/userAuth.js';

const downloadRouter = express.Router();

downloadRouter.post('/log', userAuth, logDownload);

export default downloadRouter;
