const cloudinary = require('./cloudinaryConfig');

const uploadCloudinary = async(buffer, folder, publicId)=>{
    return new Promise((resolve,reject)=>{
        // buffer로 cloudinary로 이미지 업로드(formdata로 받은 이미지는 buffer로 받아짐)
        const stream = cloudinary.uploader.upload_stream(
            {
                // 데이터의 타입
                resource_type: 'image',
                // 저장 형식(ex) .jpg)
                format: 'webp',
                // cloudinary내부 경로
                folder: `recipes/${folder}`,
                //public_id: 지정 안하면 랜덤값으로 설정
                public_id: publicId || undefined
            },(error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.public_id);
            }
        );
        // 옵션을 지정후에 파일을 올림
        stream.end(buffer); 
})
}

module.exports = { uploadCloudinary };