// ImageFileInput component
// 업로드한 이미지 파일 미리보기와 업로드버튼, 파일명 디스플레이 컴포넌트 입니다. 
// 

import React, { useState } from 'react';

const ImageFileInput = () => {
  const [imageName, setImageName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageName(file.name);
      setPreview(URL.createObjectURL(file)); // 미리보기
    }
  };

  return (
    <div>
      <div className="fileInputFrame">
        <label className="fileButton">
          <span className="selectFileText">파일 선택</span>
          <input
            className="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <input
          className='fileDisplay'
          placeholder="파일을 선택해주세요"
          value={imageName}
          readOnly // 파일명이 표시되는 input창은 사용자가 수정불가
        />
      </div>
      <p>프로필 사진 미리보기</p>
    </div>
  );
}

export default ImageFileInput;
