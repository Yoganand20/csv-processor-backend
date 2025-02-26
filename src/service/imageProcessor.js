import uploadToCloudinary from "./cloudinary.service.js";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import axios from "axios";

if (!fs.existsSync('processedImages')) {
    fs.mkdirSync('processedImages', { recursive: true });
}

export default async function processImages(imageURIs) {
    try {
        const outputDir = 'processedImages/';
        const outputImageURIs = [];
        for (const imgaeURI of imageURIs) {

            const outputFilePath = path.join(outputDir, path.basename(imgaeURI));

            const input = (await axios({ url: imgaeURI, responseType: "arraybuffer" })).data;

            await sharp(input).jpeg({ quality: 50 }).toFile(outputFilePath);
            const outputImageURI = await uploadToCloudinary(outputFilePath);

            outputImageURIs.push(outputImageURI);

        }

        return outputImageURIs;
    }
    catch (error) {
        console.error(error);
    }
}