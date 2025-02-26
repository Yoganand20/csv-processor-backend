import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});


export default async function uploadToCloudinary(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        console.log('Image uploaded successfully:', result);
        return result.url;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}