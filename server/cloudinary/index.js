// cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'disdfurag',
  api_key: '613593414999372',
  api_secret: 'GWcIsE1-t-HtCHCk83BsNdYoBso',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploadsNotes',
    resource_type: 'raw',
    format: 'pdf',
    // allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

export { cloudinary, storage };
