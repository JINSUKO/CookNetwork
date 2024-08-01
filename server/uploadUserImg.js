const express = require('express');
const multer = require('multer');
const path = require('path');

const maria = require('./module/sql');

const router = express.Router();

const uploadPath = path.join(__dirname, 'uploads', 'users', 'profile_images');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // 콜백함수, 업로드된 파일일 저장될 디렉터리 지정.
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(path.extname(file.originalname), `-${Date.now()}${path.extname(file.originalname)}`));
    }
});

const upload = multer({ storage: storage });


router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({error: '업로드할 이미지가 없습니다.'});


    console.log(req.file);
    console.log(req.body);
    //파일 위치 db에 저장하는 코드 추가해야함.

    const query = 'UPDATE users SET user_img = ? WHERE user_code = ?;'

    const result = await maria.execute(query, [req.file.filename, req.body.user_code]);

    console.log(result);

    return res.status(200).json({result});

});


module.exports = router;