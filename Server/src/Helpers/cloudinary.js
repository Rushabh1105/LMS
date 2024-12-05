const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../Config/serverConfig')

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

const uploadMedia = async(filepath) => {
    try {
        const result = await cloudinary.uploader.upload(
            filepath,
            {
                resource_type: 'auto', 
            }
        )

        return result;
    } catch (error) {
        console.log(error);
        throw {error}
    }
}

const deleteMedia = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);
    } catch (error) {
        console.log(error);
        throw {error};
    }
}

module.exports = {
    uploadMedia,
    deleteMedia
}