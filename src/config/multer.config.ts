import { diskStorage } from 'multer';

// Define the storage options
const storageOptions = {
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const newFilename = `${timestamp}_${file.originalname}.png`;
    cb(null, newFilename);
  },
};

// Create the Multer storage configuration
export const multerConfig = {
  storage: diskStorage(storageOptions),
  limits: { fileSize: 1024 * 1024 }, // 1MB
};
