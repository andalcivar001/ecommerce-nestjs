import { Storage } from '@google-cloud/storage';
import { format } from 'util';
import { v4 as uuidv4 } from 'uuid';

const uuid = uuidv4();

const storage = new Storage({
  projectId: 'ecommerce-imagenes-3b10a',
  keyFilename: './serviceAccountKey.json',
});

const bucket = storage.bucket('ecommerce-imagenes-3b10a.firebasestorage.app');

/**
 * Subir archivo a Firebase Storage
 */
export default function uploadFile(
  file: Express.Multer.File,
  pathImage: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (pathImage) {
      let fileUpload = bucket.file(`${pathImage}`);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: 'image/png',
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
        resumable: false,
      });

      blobStream.on('error', (error) => {
        console.error('Error al subir archivo a firebase', error);
        reject('Something is wrong! Unable to upload at the moment.');
      });

      blobStream.on('finish', () => {
        const url = format(
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`,
        );
        console.log('URL DE CLOUD STORAGE ', url);
        resolve(url);
      });

      blobStream.end(file.buffer);
    }
  });
}
