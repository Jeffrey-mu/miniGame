const fs = require('fs')
const axios = require('axios')
const path = require('path')
async function requesting_real_resources(url) {
  const data = await axios.get(`${url}`, { responseType: 'arraybuffer' })
  console.log(data.data)
  await writeFileWithDirectories('12ca38f90.png', data.data)
  return data
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


requesting_real_resources('http://127.0.0.1:3230/mecha-beasts.apps.minigame.vip/assets/resources/native/12/12ca38f90.png')
