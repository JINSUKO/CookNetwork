import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import SignUpStyles from "../assets/styles/SignUp.module.css";

const UserInfoModal = ({ show, setEmail, setSex, setShowUserInfoModal, loginUser}) => {
    const API_URL = import.meta.env.VITE_HOST_IP;

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [postEmail, setPostEmail] = useState('');
    const [postSex, setPostSex] = useState('');
    const [postPassword, setPostPassword] = useState('');
    const [checkConfirm, setCheckConfirm] = useState(true);
        console.log(typeof loginUser.sex)

    const userInfoConfirm = async () => {

        if (!checkConfirm || !postEmail) return alert('유저 정보가 유효하지 않습니다. 다시 입력해주세요.');


        setShowUserInfoModal(false);
        console.log(postEmail);
        console.log(postSex);
        console.log(postPassword);
        try {
            const response = await fetch(`${API_URL}/api/userInfoUpdate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: postEmail, sex: postSex, user_id: loginUser.user_id})
            }); // 비밀번호 변경은 나중으로 미룸.

            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();
            setEmail(postEmail)
            setSex(parseInt(postSex))

            loginUser.email = postEmail;
            loginUser.sex = parseInt(postSex);

            localStorage.setItem('loginUser', JSON.stringify(loginUser));

            console.log('유저 일반 정보 업데이트 성공!');


        } catch (e) {
            console.log(e);
        }
    };

    const userInfoCancel = () => {
        console.log('유저 일반 정보 변경 취소');
        setShowUserInfoModal(false);
    };

    const getUserEmailEventListener = (e) => {
        const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 이메일
        if (!regEmail.test(e.target.value)) {
            setEmailError("올바른 이메일 주소를 입력하세요.");
            setCheckConfirm(false);
        } else {
            setEmailError('');
            setCheckConfirm(true);
        }
        setPostEmail(e.target.value);

    }

    const getUserSexEventListener = (e) => {
        setPostSex(e.target.value);
    }

    // 비밀번호 수정 기능 나중에 구현.
    const getUserPwEventListener = (e) => {
        const regPw = /^[0-9a-zA-Z]{8,16}$/;

        // 비밀번호
        if (!regPw.test(e.target.value)) {
            setPasswordError("8-16자 영어+숫자로 작성하세요.");
            setCheckConfirm(false);
        } else {
            setPasswordError('');
            setCheckConfirm(true);
        }

        setPostPassword(e.target.value);

    }

    return (
        <Modal show={show} onHide={userInfoCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                변경 전: {loginUser.email}
                <br/>
                변경 후: <input type='text' defaultValue={''} onChange={getUserEmailEventListener}/>
                <p>{emailError}</p>
                <label className="infoOptionalText">성별:<br/>
                </label> <label>
                    남성<input
                    className={SignUpStyles.userSexRadio}
                    type="radio"
                    value="0"
                    name="userSex"
                    onChange={getUserSexEventListener} defaultChecked={loginUser.sex === 0}/>
                </label> <label>
                    여성<input
                    className={SignUpStyles.userSexRadio}
                    type="radio"
                    value="1"
                    name="userSex"
                    onChange={getUserSexEventListener} defaultChecked={loginUser.sex === 1}/>
                </label>
                <br/>
                {/*비밀번호: <input type='password' defaultValue={''} onChange={getUserPwEventListener}/>*/}
                {/*<p>{passwordError}</p>*/}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={userInfoConfirm}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={userInfoCancel}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UserInfoModal;