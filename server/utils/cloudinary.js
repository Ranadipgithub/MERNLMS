const cloudinary = require("cloudinary").v2;

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async(filePath) => {
    try{
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        return result;
    } catch (error) {
        console.error("Error uploading media to Cloudinary:", error);
        throw error;
    }
}

const deleteMediaFromCloudinary = async(publicId) => {
    try{
        await cloudinary.uploader.destroy(publicId);
        // cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        // return result;
    } catch (error) {
        console.error("Error deleting media from Cloudinary:", error);
        throw error;
    }
}

module.exports = {
    uploadMediaToCloudinary,
    deleteMediaFromCloudinary
}














// const deleteMediaFromCloudinary = async(publicId, resourceType = "auto") => {
//   try {
//     const options = {};
//     if (resourceType && resourceType !== "image") {
//       options.resource_type = resourceType; // e.g., "video" or "raw"
//     }
//     const result = await cloudinary.uploader.destroy(publicId, options);
//     console.log("Cloudinary delete result:", result);
//     return result;
//   } catch (error) {
//     console.error("Error deleting media from Cloudinary:", error);
//     throw error;
//   }
// };
