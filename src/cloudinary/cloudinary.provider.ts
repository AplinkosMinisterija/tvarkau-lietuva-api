import { v2, ConfigOptions } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: process.env['CLOUDINARY_NAME'],
      api_key: process.env['CLOUDINARY_KEY'],
      api_secret: process.env['CLOUDINARY_SECRET'],
    });
  },
};
