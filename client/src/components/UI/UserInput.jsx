// UserInput component
// 사용자가 값을 입력할 입력 창을 만드는 컴포넌트입니다. 
// 입력창의 타입(텍스트 등), 입력 예시(placeholder), 값(value), 이름(name), 값이 변경될 때 실행할 함수 등을 받아와 사용합니다. 사용자가 입력한 값이 value로 전달되고, 값이 변경될 때마다 onChange 함수가 실행됩니다.

import React from 'react';
// import './UserInput.css';

const UserInput = ({ type, placeholder, value, name, onChange }) => {
  return (
    <input
      className="userInput"
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={value}
      name={name}
    />
  );
};

export default UserInput;