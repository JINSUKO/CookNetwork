import {useState} from "react";
import {Button, Modal} from "react-bootstrap";

const UserNameModal = ({ show, setUsername, setShowUserNameModal, loginUser}) => {
    const API_URL = import.meta.env.VITE_HOST_IP;

    const [usernameError, setUsernameError] = useState('');
    const [postUsername, setPostUsername] = useState('');
    const [checkConfirm, setCheckConfirm] = useState(true);

    const usernameConfirm = async () => {

        if (!checkConfirm) return alert('닉네임이 유효하지 않습니다. 다시 입력해주세요.');


        setShowUserNameModal(false);

        console.log(postUsername);
        try {
            const response = await fetch(`${API_URL}/api/userNameUpdate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: postUsername, user_code: loginUser.user_code})
            });

            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();
            setUsername(postUsername)

            loginUser.username = postUsername;

            localStorage.setItem('loginUser', JSON.stringify(loginUser));

            console.log('username 업데이트 성공!');


        } catch (e) {
            console.log(e);
        }
    };

    const usernameCancel = () => {
        console.log('유저 닉네임 변경 취소');
        setShowUserNameModal(false);
    };

    const getUsernameEventListener = (e) => {
        const regNickname = /^[a-zA-Z가-힣]{2,16}$/;

        // 닉네임
        if (!regNickname.test(e.target.value)) {
            setUsernameError("닉네임은 한글 또는 영문 2~16자로 작성하세요.");
            setCheckConfirm(false);
        } else {
            setUsernameError('');
            setCheckConfirm(true);
        }

        setPostUsername(e.target.value);
    }

    return (
        <Modal show={show} onHide={usernameCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                변경 전: {loginUser.username}
                <br/>
                변경 후: <input type='text' defaultValue={''} onChange={getUsernameEventListener} />
                <p>{usernameError}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={usernameConfirm}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={usernameCancel}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UserNameModal;