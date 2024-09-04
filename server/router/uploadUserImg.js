const express = require('express');
const multer = require('multer');
const path = require('path');

const maria = require('../module/sql');

const router = express.Router();

const uploadPath = path.join(__dirname, '../', 'uploads', 'users', 'profile_images');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // 콜백함수, 업로드된 파일일 저장될 디렉터리 지정.
    },
    filename: (req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const extension = path.extname(file.originalname);
        cb(null, originalName.replace(extension, `-${Date.now()}${extension}`));
    }
});

const upload = multer({ storage: storage });


router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({error: '업로드할 이미지가 없습니다.'});

    try {

        const query = 'UPDATE users SET user_img = ? WHERE user_id = ?;'

        const result = await maria.execute(query, [req.file.filename, req.body.user_id]);


        return res.status(200).json({result});
    } catch (e) {
        return res.status(400).json({error: e});
    }

});


module.exports = router;