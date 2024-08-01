import { useState, useRef } from 'react';
import {Image, Container, Row, Col, Nav, InputGroup, FormControl, Button, Card, Modal} from 'react-bootstrap';

const UserPage = ({user, profilePic}) => {

    const API_URL = 'http://localhost:3000';

    const [activeTab, setActiveTab] = useState('userInfo');
    const [profileImgDB, setProfileImgDB] = useState(profilePic);
    const [profileImg, setProfileImg] = useState(null);

    const fileInputRef = useRef(null);

    const handleFileInputChange = (event) => {
        // 파일이 선택되었을 때의 로직
        const file = event.target.files[0];

        if (!file) return setProfileImgDB(profilePic);

        if (!file.type.startsWith('image/')) return alert('이미지 파일만 선택해주세요.');

        setProfileImg(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImgDB(e.target.result);
        }
        reader.readAsDataURL(file);


        setShowDialog(true)


    };

    const handleProfileEditClick = () => {

        fileInputRef.current.click();
    };

    // 확인 대화상자 부분 시작
    const [showDialog, setShowDialog] = useState(false);

    const handleConfirm = async () => {
        console.log('User confirmed');
        setShowDialog(false);
        // 파일 서버로 저장하는 코드 작성해야함.
        // 파일 저장 formData 객체 생성
        const formData = new FormData();
        console.log('fetch 직전 file:', profileImg)
        formData.append('file', profileImg);
        formData.append('user_code', user.user_code);

        try {
            const response = await fetch(`${API_URL}/api/uploadUserImg`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const result = response.json();


            setProfileImgDB(profileBasePath + user.user_img);

            console.log('파일 업로드 성공!');

        } catch (e) {
            console.error('Error:', e);
        }
    };

    const handleCancel = () => {
        console.log('User canceled');
        setShowDialog(false);
        setProfileImgDB(profilePic);
    };

    const ConfirmDialog = ({ show, message, onConfirm, onCancel }) => {
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
    // 확인 대화상자 부분 끝

    return (
        <Container fluid className="p-3">

            {/* Header */}
            {/*<header className="mb-4">*/}
            {/*    <Row className="align-items-center mb-3">*/}
            {/*        <Col>*/}
            {/*            <h1 className="display-6 fw-bold text-warning">COOKNET</h1>*/}
            {/*        </Col>*/}
            {/*        <Col xs="auto">*/}
            {/*            <InputGroup>*/}
            {/*                <FormControl placeholder="Value" aria-label="Value"/>*/}
            {/*                <Button variant="outline-secondary">x</Button>*/}
            {/*            </InputGroup>*/}
            {/*        </Col>*/}
            {/*        <Col xs="auto">*/}
            {/*            <Nav>*/}
            {/*                <Nav.Link>공지사항</Nav.Link>*/}
            {/*                <Nav.Link>마이페이지</Nav.Link>*/}
            {/*                <Nav.Link>로그아웃</Nav.Link>*/}
            {/*            </Nav>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*    <Nav variant="tabs" className="justify-content-between">*/}
            {/*        <Nav.Item style={{flex: 1}}><Nav.Link className="text-center">한식</Nav.Link></Nav.Item>*/}
            {/*        <Nav.Item style={{flex: 1}}><Nav.Link className="text-center">양식</Nav.Link></Nav.Item>*/}
            {/*        <Nav.Item style={{flex: 1}}><Nav.Link className="text-center">일식&아시안</Nav.Link></Nav.Item>*/}
            {/*        <Nav.Item style={{flex: 1}}><Nav.Link className="text-center">중식</Nav.Link></Nav.Item>*/}
            {/*    </Nav>*/}
            {/*</header>*/}

            {/* Main Content */}
            <Row className="g-4">
                {/* Left Column */}
                <Col md={4}>
                    <div className="text-center">
                        <Image src={profileImgDB} style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            border: '1px solid #000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                        }}/>
                        <h5 className="mb-3">{user.username}</h5>
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
                                    <ConfirmDialog
                                        show={showDialog}
                                        message="선택된 사진으로 변경하려면 확인을 눌러주세요."
                                        onConfirm={handleConfirm}
                                        onCancel={handleCancel}
                                    />
                                </>
                            }
                            <Button variant="dark" size="sm" className="mb-2">닉네임 수정하기</Button>
                        </div>
                        <Row className="justify-content-center g-2 mb-3">
                            <Col>
                                <FormControl size="sm" placeholder="찜기한 레시피 수: 000" readOnly />
                            </Col>
                        </Row>
                        <Row className="justify-content-center g-2 mb-3">
                            <Col>
                                <FormControl size="sm" placeholder="찜한 식당 수: 000" readOnly />
                            </Col>
                        </Row>
                        <div className="mb-3">
                            {['Label', 'Label', 'Label'].map((label, idx) => (
                                <Button key={idx} variant="dark" size="sm" className="me-2 mb-2">{label}</Button>
                            ))}
                            {['Label', 'Label'].map((label, idx) => (
                                <Button key={idx} variant="secondary" size="sm" className="me-2 mb-2">{label}</Button>
                            ))}
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
                                    <Card.Title className="mb-3">닉네임: {user.username}</Card.Title>
                                    <Card.Text>
                                        성별: {user.sex ? "여" : "남"}<br />
                                        이메일: {user.email}<br />
                                        유저 등급: {user.user_code <= 10 ? "운영자 계정" : (user.chef_code ? "셰프 계정" : "일반 계정")}
                                    </Card.Text>
                                    <Button variant="dark" size="sm" className="mb-2">화원 정보 수정하기</Button>
                                    <h6 className="mb-3">카테고리 찜 목록</h6>
                                    <div className="mb-3">
                                        {['한식', '양식', '일식&아시안', '중식', '기타'].map((category, idx) => (
                                            <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2">{category}</Button>
                                        ))}
                                    </div>

                                    <Button variant="outline-primary" size="sm" className="me-2">카테고리 찜하기</Button>
                                    <Button variant="outline-danger" size="sm">카테고리 제거하기</Button>
                                    <div className="mt-3">
                                        {['Label', 'Label', 'Label', 'Label', 'Label'].map((label, idx) => (
                                            <Button key={idx} variant="dark" size="sm" className="me-2 mb-2">{label}</Button>
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
                                                <div style={{width: '100%', paddingBottom: '100%', background: '#f0f0f0'}}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                    <h6 className="mb-3">최근 북마크 레시피</h6>
                                    <Row xs={2} md={3} lg={6} className="g-2 mb-4">
                                        {[...Array(6)].map((_, idx) => (
                                            <Col key={idx}>
                                                <div style={{width: '100%', paddingBottom: '100%', background: '#f0f0f0'}}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                    <h6 className="mb-3">카테고리 최신 레시피</h6>
                                    <Row xs={2} md={3} lg={6} className="g-2">
                                        {[...Array(6)].map((_, idx) => (
                                            <Col key={idx}>
                                                <div style={{width: '100%', paddingBottom: '100%', background: '#f0f0f0'}}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserPage;