const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary');
const router = express.Router()

require('dotenv').config({ path: '.env.local' })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KRY,
})

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/",upload.array('images'),async (req,res)=>{


})

module.exports = router;