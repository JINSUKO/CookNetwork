/* 사용자의 마이페이지
*   운영자, 셰프, 일반 유저 모두 동일한 마이페이지 사용함.
* */
import {useState, useRef, useEffect} from 'react';
import {Image, Container, Row, Col, Nav, InputGroup, FormControl, Button, Card, Modal} from 'react-bootstrap';
import UserNameModal from '../components/UserNameModal'

import authFetch from '../fetchInterceptorAuthToken'


// localStorage 에서 받아온 loginUser로 user, profilePic 를 대체하는 코드로 수정해야함.
const UserMyPage = ({user, profilePic, loginUser}) => {

    loginUser = JSON.parse(loginUser)

    const API_URL = import.meta.env.VITE_HOST_IP;

    const [activeTab, setActiveTab] = useState('userInfo');
    const [profileImgDBbase64, setProfileImgDBbase64] = useState(profilePic);
    const [profileImg, setProfileImg] = useState(null);
    const [categories, setCategories] = useState(null);

    console.log('categories', categories)
    const fileInputRef = useRef(null);

    const accessToken = localStorage.getItem('accessToken');
    console.log('잘오고 있지? at UserMypage first', accessToken)

    const handleFileInputChange = (event) => {
        // 파일이 선택되었을 때의 로직
        const file = event.target.files[0];

        if (!file) return setProfileImgDBbase64(profilePic);

        if (!file.type.startsWith('image/')) return alert('이미지 파일만 선택해주세요.');

        setProfileImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImgDBbase64(e.target.result);
        }
        reader.readAsDataURL(file);


        setShowImgConfirmModal(true)


    };

    const handleProfileEditClick = () => {

        fileInputRef.current.click();
    };

    // 프로필 이미지 변경 확인 대화상자 부분 시작
    const [showImgConfirmModal, setShowImgConfirmModal] = useState(false);

    const uploadProfileConfirm = async () => {
        setShowImgConfirmModal(false);
        // 파일 저장 formData 객체 생성
        const formData = new FormData();
        console.log('fetch 직전 file:', profileImg)
        formData.append('file', profileImg);
        formData.append('user_id', user.user_id);

        try {
            const response = await fetch(`${API_URL}/api/uploadUserImg`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const result = await response.json();



            loginUser.user_img = profileImgDBbase64;

            localStorage.setItem('loginUser', JSON.stringify(loginUser));
            // console.log('profile img upload result:', result.result);

            console.log('프로필 이미지 업로드 성공!');

        } catch (e) {
            console.error(e);
        }
    };

    const uploadProfileCancel = () => {
        console.log('프로필 사진 업로드 취소');
        setShowImgConfirmModal(false);
        setProfileImgDBbase64(profilePic);
    };

    const ImgConfirmModal = ({ show, message, onConfirm, onCancel }) => {
        return (
            <Modal show={show} onHide={onCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onConfirm}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    // 프로필 이미지 변경 확인 대화상자 부분 끝

    // 마이페이지에서 유저가 등록한 선호 카테고리 목록 데이터 요청 코드.
    const getUserCategories = async () => {

        try {
            const response = await fetch(`${API_URL}/api/userCategories`, {
            // const response = await authFetch(`${API_URL}/api/userCategories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_id: user.user_id})
            });
            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();

            console.log("유저의 카테고리 목록 호출 성공!");
            setCategories(result);

        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('잘오고 있지? at UserMypage third', accessToken)
        // 마이페이지에서 유저가 `등록한 선호 카테고리 목록 데이터 요청 코드.
        getUserCategories();

    }, []);

    // 닉네임 수정 기능 시작
    const [showUserNameModal, setShowUserNameModal] = useState(false);
    const [username, setUsername] = useState(loginUser.username);


    // 닉네임 수정 기능 끝


    return (
        <Container fluid className="p-3">

            {/* Main Content */}
            <Row className="g-4">
                {/* Left Column */}
                <Col md={4}>
                    <div className="text-center">
                        <Image src={profileImgDBbase64} style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                        }}/>
                        <h5 className="mb-3">{username}</h5>
                        <div className="mb-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                style={{display: 'none'}}
                                accept="image/*"
                            />
                            { (user.user_code <= 11 || user.chef_code === 1 )
                                &&
                                <>
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        className="me-2 mb-2"
                                        onClick={handleProfileEditClick}
                                    >
                                        사진 변경하기
                                    </Button>
                                    <ImgConfirmModal
                                        show={showImgConfirmModal}
                                        message="선택된 사진으로 변경하려면 확인을 눌러주세요."
                                        onConfirm={uploadProfileConfirm}
                                        onCancel={uploadProfileCancel}
                                    />
                                </>
                            }
                            <Button variant="dark" size="sm" className="mb-2" onClick={() => {setShowUserNameModal(true)}} >닉네임 수정하기</Button>
                            <UserNameModal
                                show={showUserNameModal}
                                preUsername={username}
                                setUsername={setUsername}
                                setShowUserNameModal={setShowUserNameModal}
                                loginUser={loginUser}
                            />
                        </div>
                        <Row className="justify-content-center g-2 mb-3">
                            <Col>
                                <FormControl size="sm" placeholder="평가한 레시피 수: 000" readOnly />
                            </Col>
                        </Row>
                        <Row className="justify-content-center g-2 mb-3">
                            <Col>
                                <FormControl size="sm" placeholder="북마크 레시피 수: 000" readOnly />
                            </Col>
                        </Row>
                        <div className="mb-3">
                            {categories && categories.map((category, idx) => (
                                <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2">{category.category_name}</Button>
                            ))}
                            {/*{['Label', 'Label', 'Label'].map((label, idx) => (*/}
                            {/*    <Button key={idx} variant="dark" size="sm" className="me-2 mb-2">{label}</Button>*/}
                            {/*))}*/}
                            {/*{['Label', 'Label'].map((label, idx) => (*/}
                            {/*    <Button key={idx} variant="secondary" size="sm" className="me-2 mb-2">{label}</Button>*/}
                            {/*))}*/}
                        </div>
                    </div>
                </Col>

                {/* Right Column */}
                <Col md={8}>
                    <Card className="mb-4" style={{ border: 'none' }}>
                        <Card.Header className="bg-white">
                            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="userInfo"
                                        style={{color: activeTab === 'userInfo' ? '#F17F42' : '#aaa', borderBottom: activeTab === 'userInfo' ? '2px solid #F17F42' : 'none'}}
                                    >
                                        회원 정보
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="activity"
                                        style={{color: activeTab === 'activity' ? '#F17F42' : '#aaa', borderBottom: activeTab === 'activity' ? '2px solid #F17F42' : 'none'}}
                                    >
                                        활동
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body>
                            {activeTab === 'userInfo' && (
                                <>
                                    <Card.Title className="mb-3">닉네임: {username}</Card.Title>
                                    <Card.Text>
                                        성별: {user.sex ? "여" : "남"}<br />
                                        이메일: {user.email}<br />
                                        유저 등급: {user.user_code <= 10 ? "운영자 계정" : (user.chef_code ? "셰프 계정" : "일반 계정")}
                                    </Card.Text>
                                    <Button variant="dark" size="sm" className="mb-2">회원 정보 수정하기</Button>
                                    <div style={{marginTop:"30px"}}></div>
                                    <h6 className="mb-3">카테고리 찜 목록</h6>

                                    <Button variant="outline-primary" size="sm" className="me-2">카테고리 찜하기</Button>
                                    <Button variant="outline-danger" size="sm">카테고리 제거하기</Button>

                                    <div className="mb-3" style={{marginTop:"10px"}}>
                                        {categories && categories.map((category, idx) => (
                                            <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2">{category.category_name}</Button>
                                        ))}
                                    </div>

                                </>
                            )}
                            {activeTab === 'activity' && (
                                <>
                                    <h6 className="mb-3">최근 평가한 레시피</h6>
                                    <Row xs={2} md={3} lg={6} className="g-2 mb-4">
                                        {[...Array(6)].map((_, idx) => (
                                            <Col key={idx}>
                                                <div style={{
                                                    width: '100%',
                                                    paddingBottom: '100%',
                                                    background: '#f0f0f0'
                                                }}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                    <h6 className="mb-3">최근 북마크 레시피</h6>
                                    <Row xs={2} md={3} lg={6} className="g-2 mb-4">
                                        {[...Array(6)].map((_, idx) => (
                                            <Col key={idx}>
                                                <div style={{
                                                    width: '100%',
                                                    paddingBottom: '100%',
                                                    background: '#f0f0f0'
                                                }}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                    <h6 className="mb-3">카테고리 최신 레시피</h6>
                                    {categories && categories.map((category, idx) => (
                                        <Button key={idx} variant="outline-secondary" size="sm"
                                                className="me-2 mb-2">{category.category_name}</Button>
                                    ))}
                                    <Row xs={2} md={3} lg={6} className="g-2 mb-4">
                                        {[...Array(6)].map((_, idx) => (
                                            <Col key={idx}>
                                                <div style={{
                                                    width: '100%',
                                                    paddingBottom: '100%',
                                                    background: '#f0f0f0'
                                                }}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                    { (user.user_code <= 11 || user.chef_code === 1 )
                                        && <div>
                                                <h6 className="mb-3"> 레시피</h6>
                                                <Row xs={2} md={3} lg={6} className="g-2">
                                                    {[...Array(6)].map((_, idx) => (
                                                        <Col key={idx}>
                                                            <div style={{
                                                                width: '100%',
                                                                paddingBottom: '100%',
                                                                background: '#f0f0f0'
                                                            }}></div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                           </div>
                                    }
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default UserMyPage;