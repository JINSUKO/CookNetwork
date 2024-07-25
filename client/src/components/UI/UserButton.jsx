/* UserButton component
로그인과 회원가입 페이지에서 사용할 UserButton 컴포넌트입니다. 
사용자가 이 버튼을 클릭했을 때 이벤트 동작이 발생합니다. (onClick)
사용자가 UserInput 값을 입력했을 때 클릭 가능 여부를 조절할수 있습니다.
*/

import React from 'react';
import UserButtonStyles from '../../assets/styles/UserButton.module.css';

const handleSubmit = (e) => {
  return 1
}

const UserButton = (props) => {
  return (
    <div>
      <button
        className={UserButtonStyles.userButton}
        onClick={handleSubmit}
        disabled={props.disabled}
      >{props.text}
      </button>
    </div>
  );
};

export default UserButton;