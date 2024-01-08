const fs = require('fs')
const axios = require('axios')
const path = require('path')
var log4js = require("log4js");

const config = require('../logs/log4js.json'); // Adjust the path based on your configuration file location
log4js.configure(config);
const logger = log4js.getLogger();

async function requesting_real_resources(req) {
    if (req.method == 'GET') {
        // 获取真实地址
        try {
            const data = await axios.get(`https://${req.url}`, { responseType: 'arraybuffer' })

            return await writeFileWithDirectories(query_path(req), data.data)
        } catch (error) {
            logger.error(error);
            return error
        }
    }
}

function verify_resources(req) {
    return fileExists(query_path(req))
}
async function writeFileWithDirectories(filePath, data) {
    try {
        // Ensure the directory exists, creating it recursively if needed
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        if (Buffer.isBuffer(data)) {
            // If the data is a Buffer (e.g., Blob data), write it directly
            fs.writeFileSync(filePath, data);
        } else if (typeof data === 'string') {
            // If the data is a string, write it as is
            fs.writeFileSync(filePath, data);
        } else if (data instanceof ArrayBuffer) {
            // If the data is an ArrayBuffer (e.g., Blob data), convert it to Buffer and write
            const buffer = Buffer.from(data);
            fs.writeFileSync(filePath, buffer);
        } else {
            // For other types, convert to JSON string and write
            const jsonStr = JSON.stringify(data);
            fs.writeFileSync(filePath, jsonStr);
        }
        return `File "${filePath.split('/')[filePath.split('/').length - 1]}" has been written successfully.`
    } catch (error) {
        logger.error(`Error writing file "${filePath}":`, error.message);
        console.error(`Error writing file "${filePath}":`, error.message);
    }
}

function query_path(req) {
    return path.resolve(__dirname, '../../') + '/games' + req.url
}

function fileExists(filePath) {
    try {
        // Check if the file exists
        fs.accessSync(filePath, fs.constants.F_OK);
        return true; // File exists
    } catch (error) {
        return false; // File doesn't exist
    }
}

function isFileType(url) {
    const file_types = [
        'bin',
        // Image formats
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',

        // Audio formats
        'mp3', 'ogg', 'wav',

        // Video formats (if your game includes videos)
        'mp4', 'webm', 'ogv',

        // Font formats
        'ttf', 'otf', 'woff', 'woff2',

        // JSON data (for configuration, levels, etc.)
        'json',

        // Text files (if needed)
        'txt',

        // 3D models (if your game uses 3D assets)
        'obj', 'fbx', 'gltf',

        // Other asset formats (adjust based on your game's requirements)
        'xml', 'csv', 'yaml', 'css', 'js'
    ];
    // Assuming req.url is something like "/path/to/resource/file.txt"
    const urlParts = url.split('/');

    // Get the last item
    const lastItem = urlParts[urlParts.length - 1];

    // Split the last item by dot (.)
    const fileParts = lastItem.split('.');

    // Get the last part after the last dot
    const fileExtension = fileParts[fileParts.length - 1];

    return file_types.includes(fileExtension)
}

function getGameList() {
    fs.writeFileSync(path.join(__dirname, '../../public/json/games.json'), JSON.stringify(fs.readdirSync(path.join(__dirname, '../../games')).filter(item => item.length > 12)))
}
module.exports = {
    requesting_real_resources,
    verify_resources,
    isFileType,
    getGameList,
    logger
}
