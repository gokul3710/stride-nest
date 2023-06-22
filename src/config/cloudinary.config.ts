import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFilesToCloudinary = async (filePaths: string[]) => {
  try {
    const uploadPromises = filePaths.map((filePath) => {
      return cloudinary.uploader.upload(filePath);
    });

    const results = await Promise.all(uploadPromises);

    return results.map((image) => image.secure_url);
  } catch (error) {
    console.error('Error uploading files to Cloudinary:', error);
  }
};

export default cloudinary;
