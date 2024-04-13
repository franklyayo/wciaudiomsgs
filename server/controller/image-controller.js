import File from '../models/file.js';
import dotenv from 'dotenv';
import FileHandlerService from '../libs/file-handler.lib.js';

dotenv.config();

export const uploadImage = async (request, response) => {
  // console.log('file', request.file);
  // const fileObj = {
  //   path: request.file.path,
  //   name: request.file.originalname,
  // };

  try {
    const fileHandlerService = new FileHandlerService();
    const result = await fileHandlerService.uploadToS3(request.file);

    return response.status(200).json({ path: result.Location });
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: error.message });
  }
};

export const getImage = async (request, response) => {
  try {
    const file = await File.findById(request.params.fileId);

    file.downloadCount++;

    await file.save();

    response.download(file.path, file.name);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ msg: error.message });
  }
};
