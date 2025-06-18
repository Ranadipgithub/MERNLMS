const express = require("express");
const multer = require("multer");
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../../utils/cloudinary");
const fs = require("fs/promises"); 

const router = express.Router();

const upload = multer({dest: 'uploads/'});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const filePath = req.file.path;
  try {
    const result = await uploadMediaToCloudinary(filePath);
    // Delete local file after successful upload
    await fs.unlink(filePath);
    return res.status(200).json({
      success: true,
      message: "Media uploaded successfully",
      data: result,
    });
  } catch (error) {
    // delete local file even if upload failed
    try {
      await fs.unlink(filePath);
    } catch (unlinkErr) {
      console.error("Failed to delete temp file:", unlinkErr);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to upload media",
      error: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
    try{
        const publicId = req.params.id;
        if(!publicId){
            return res.status(400).json({
                success: false,
                message: "Public ID is required",
            });
        }
        await deleteMediaFromCloudinary(publicId);
        res.status(200).json({
            success: true,
            message: "Media deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete media",
            error: error.message,
        });
    }
})

router.post('/bulk-upload', upload.array('files', 10), async(req, res) => {
  try{
    const uploadPromises = req.files.map(fileItem => uploadMediaToCloudinary(fileItem.path));
    const results = await Promise.all(uploadPromises);
    // Delete local files after successful upload
    const deletePromises = req.files.map(fileItem => fs.unlink(fileItem.path));
    await Promise.all(deletePromises);
    return res.status(200).json({
      success: true,
      message: "Media uploaded successfully",
      data: results,
    });
  } catch(err){
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to upload media",
      error: err.message,
    })
  }
})

module.exports = router;