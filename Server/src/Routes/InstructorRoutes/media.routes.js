const express = require('express');
const multer = require('multer');
const { uploadMedia, deleteMedia } = require('../../Helpers/cloudinary');
const { authenticate } = require('../../Middlewares/auth.middleware');

const mediaRouter = express.Router();

const upload = multer({dest: 'uploads/'});

mediaRouter.post('/upload', upload.single('file'), async(req, res, next) => {
    try {
        // authenticate(req, res, next);
        const result = await uploadMedia(req.file.path);
        return res.status(201).json({
            success: true,
            message: 'Media uploaded successfully',
            data: result,
            error: null
        })
    } catch (error) {
        next(error);
    }
});


mediaRouter.delete('/delete/:id', async(req, res, next) => {
    try {
        // authenticate(req, res, next);
        const id = req.params.id;
        console.log(id);
        if(!id){
            return res.status(400).json({
                success: false,
                message: 'Assets id is missing',
                data: null,
                error: null
            });
        }

        await deleteMedia(id);
        return res.status(200).json({
            success: true,
            message: 'Media deleted successfully',
            data: null,
            error: null
        })
    } catch (error) {
        next(error);
    }
});


mediaRouter.post('/bulk-upload', upload.array('files', 10), async(req, res, next) => {
    try {
        const uploadPromises = req.files.map((fileItem) =>
            uploadMedia(fileItem.path)
          );
      
        const result = await Promise.all(uploadPromises);
        return res.status(201).json({
            success: true,
            message: 'Media uploaded successfully',
            data: result,
            error: null
        })
    } catch (error) {
        next(error);
    }
})


module.exports = mediaRouter;