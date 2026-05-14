import downloadLogModel from '../model/DownloadLogModel.js';
import https from 'https';
import http from 'http';export const logDownload = async (req, res) => {
    try {
        const { fileName, location } = req.body;
        const userId  = req.user?.id   || null;
        const email   = req.user?.email || req.body.email || "unknown";
        const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
                       || req.socket?.remoteAddress
                       || req.ip
                       || "unknown";

        if (!fileName) {
            return res.json({ success: false, message: "fileName is required" });
        }

        const log = new downloadLogModel({
            userId,
            email,
            fileName,
            ipAddress,
            location: location || { lat: null, long: null }
        });

        await log.save();

        return res.json({ success: true, message: 'Download logged successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const proxyDownload = (req, res) => {
    const { url, filename } = req.query;
    if (!url) return res.status(400).send("URL required");

    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (fileRes) => {
        res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
        res.setHeader('Content-Type', fileRes.headers['content-type'] || 'application/octet-stream');
        fileRes.pipe(res);
    }).on('error', (err) => {
        res.status(500).send("Error downloading file");
    });
};
