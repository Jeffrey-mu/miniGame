const fs = require('fs')
const axios = require('axios')
const path = require('path')
async function requesting_real_resources(req) {
  if (req.method == 'GET') {
    const data = await axios.get(`https://${req.url}`, { responseType: 'arraybuffer' })
    console.log(data.data)
    await writeFileWithDirectories(query_path(req), data.data)
    return data
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
    console.log(`File "${filePath}" has been written successfully.`);
  } catch (error) {
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

module.exports = {
  requesting_real_resources,
  verify_resources,
}
