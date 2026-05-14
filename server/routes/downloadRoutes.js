import express from 'express';
import { logDownload, proxyDownload } from '../controllers/downloadController.js';
import userAuth from '../middleware/userAuth.js';

const downloadRouter = express.Router();

downloadRouter.post('/log', userAuth, logDownload);
downloadRouter.get('/file', proxyDownload);

export default downloadRouter;
