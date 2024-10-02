/* 사용자의 마이페이지
*   운영자, 셰프, 일반 유저 모두 동일한 마이페이지 사용함.
* */
import {useState, useRef, useEffect, useLayoutEffect, useCallback} from 'react';
import {Image, Container, Row, Col, Nav, InputGroup, FormControl, Button, Card, Modal} from 'react-bootstrap';
import UserNameModal from '../components/UserNameModal'
import UserInfoModal from '../components/UserInfoModal'
import UserCategoryModifyModal from '../components/UserCategoryModifyModal'

import authFetch from '../fetchInterceptorAuthToken'
import UserSelectedCategories from "../components/UserSelectedCategories.jsx";
import BookmarkList from '../components/Bookmark/BookmarkList.jsx';
import UserMyRecipe from '../components/UserMyRecipe.jsx';
import ConfirmModal from "../components/ConfirmModal.jsx";


const UserMyPage = ({user, setUser, profilePic, setProfilePic}) => {

    const API_URL = import.meta.env.VITE_HOST_IP;
    console.log('user', user)
    const [activeTab, setActiveTab] = useState('userInfo');
    const [profileImgDBbase64, setProfileImgDBbase64] = useState(user.user_img);
    const [profileImg, setProfileImg] = useState(null);
    const [categories, setCategories] = useState(null);
    const [userCategoryRecipes, setUserCategoryRecipes] = useState(null);
    const [userMyRecipes, setUserMyRecipes] = useState([null]);

    console.log('categories', categories)
    const fileInputRef = useRef(null);

    // user_code를 이용해서 운영자 계정인지 아닌지 판단하는 건 따로 만들어야함.

    const handleFileInputChange = (event) => {
        // 파일이 선택되었을 때의 로직
        const file = event.target.files[0];

        if (!file) return setUser((preUser) => ({...preUser, user_img: profileImgDBbase64})); //setProfileImgDBbase64(profilePic);

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


            // userInfo 변경 시와 똑같이 이거 안해도 잘 변경됨... 왜?

            // user.user_img = profileImgDBbase64;
            // setUser((preUser) => ({...preUser, user_img: profileImgDBbase64}));
            // localStorage.setItem('loginUser', JSON.stringify(loginUser));
            // console.log('profile img upload result:', result.result);

            console.log('프로필 이미지 업로드 성공!');

        } catch (e) {
            console.error(e);
        }
    };

    const uploadProfileCancel = () => {
        console.log('프로필 사진 업로드 취소');
        setProfileImg(null);
        setProfileImgDBbase64((preImgBase64) => (user.user_img));
        // input type='file'의 값을 바꿔주지않으면
        // 이미지를 선택 후 취소하고, 동일한 이미지를 다시 선택했을 때, onChange 이벤트가 트리거 되지 않는다.
        fileInputRef.current.value = null;
        setShowImgConfirmModal(false);
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
            const response = await fetch(`${API_URL}/api/userCategoryNames`, {
            // const response = await authFetch(`${API_URL}/api/userCategoryNames`, {
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
            console.log(result)

        } catch (e) {
            console.error(e);
        }
    }

    // 마이페이지에서 유저가 등록한 모든 선호 카테고리의 레시피 데이터 요청 코드.
    const getUserCategoryRecipes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/userCategoryRecipes?user_id=${user.user_id}`);

            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();
            setUserCategoryRecipes(result);
            console.log(result)

            console.log("유저의 모든 카테고리 레시피 데이터 호출 성공!");

        } catch (e) {
            console.error(e);
        }
    }

    const getUserMyRecipes = async () => {
        if (!user || (user.user_code > 11 && user.chef_code !== 1)) return;

        try {
            const response = await fetch(`${API_URL}/api/myRecipe/${user.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('최근 등록한 레시피 Failed to fetch');
            }

            const data = await response.json();
            setUserMyRecipes(data.slice(0, 8)); // Get only the 8 most recent recipes
        } catch (error) {
            console.error("Error fetching 최근 등록한 레시피:", error);
        }
    };


    useEffect(() => {
        // 마이페이지에서 유저가 등록한 선호 카테고리 목록 데이터 요청 코드.
        getUserCategories();
        // 마이페이지에서 유저가 등록한 모든 선호 카테고리의 레시피 데이터 요청 코드.
        getUserCategoryRecipes();
        // 
        getUserMyRecipes();

    }, [activeTab]); // activeTab 이 변경될 때 마다 UserMyPage가 렌더링 되어, useEffect를 다시 실행시킨다.
                          // == 탭을 누를 때 서버로 데이터 요청을 보내서 최신 데이터를 UserMyPage에 새로 보낸다.

    // 닉네임 수정 기능 시작
    const [showUserNameModal, setShowUserNameModal] = useState(false);
    const [username, setUsername] = useState(user.username);
    // 닉네임 수정 기능 끝


    // 일반 정보 수정 기능 시작
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [sex, setSex] = useState(user.sex);
    const [password, setPassword] = useState('');
    // 일반 정보 수정 기능 끝

    // 카테고리 등록 삭제 시작
    const [showUserCategories, setShowUserCategories] = useState(false);
    // 카테고리 등록 삭제 끝

    // 회원 탈퇴 기능 시작
    const deleteUser = useCallback(async () => {

        // todo 비밀번호 확인하는 로직으로 검증 한 번 해야 할 듯.
        // 그럼 비밀번호 입력하고 회원탈퇴 확인받는 모달 하나 만들어야할 듯.


        try {
            const response = await fetch(`${API_URL}/api/userDelete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId: user.user_id})
            });

            const data = await response.json();

            localStorage.removeItem('accessToken');
            localStorage.removeItem('loginUser');

            alert(data.message);

            window.location.href = '/';

        } catch (e) {
            console.error(e);
        }


    })


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
                                    <ConfirmModal
                                        show={showImgConfirmModal}
                                        title="이미지 변경"
                                        message="선택된 사진으로 변경하려면 확인을 눌러주세요."
                                        onConfirm={uploadProfileConfirm}
                                        onCancel={uploadProfileCancel}
                                    />
                                </>
                            }
                            <Button variant="dark" size="sm" className="mb-2" onClick={() => {setShowUserNameModal(true)}} >닉네임 수정하기</Button>
                            <UserNameModal
                                show={showUserNameModal}
                                setUsername={setUsername}
                                setShowUserNameModal={setShowUserNameModal}
                                user={user}
                                setUser={setUser}
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
                                <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2">{category}</Button>
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
                                    <Card.Title className="mb-3">닉네임: {user.username}</Card.Title>
                                    <Card.Text>
                                        성별: {sex ? "여" : "남"}<br />
                                        이메일: {email}<br />
                                        유저 등급: {user.user_code <= 10 ? "운영자 계정" : (user.chef_code ? "셰프 계정" : "일반 계정")}
                                    </Card.Text>
                                    <Button variant="dark" size="sm" className="mb-2" onClick={() => {setShowUserInfoModal(true)}}>회원 정보 수정하기</Button>
                                    <UserInfoModal
                                        show={showUserInfoModal}
                                        setEmail={setEmail}
                                        setSex={setSex}
                                        setShowUserInfoModal={setShowUserInfoModal}
                                        user={user}
                                        setUser={setUser}
                                    />
                                    &nbsp;
                                    <Button variant="danger" size="sm" className="mb-2" onClick={() => {deleteUser()}}>회원 탈퇴하기</Button>
                                    <div style={{marginTop:"30px"}}></div>
                                    <h6 className="mb-3">카테고리 찜 목록</h6>

                                    <Button variant="outline-success" size="sm" className="me-2" onClick={() => {setShowUserCategories(true)}}>카테고리 찜하기</Button>
                                    {categories && <UserCategoryModifyModal
                                        show={showUserCategories}
                                        userCategories={categories}
                                        setUserCategories={setCategories}
                                        setShowUserCategories={setShowUserCategories}
                                        user={user}
                                    />}

                                    <div className="mb-3" style={{marginTop:"10px"}}>
                                        {categories && categories.map((category, idx) => (
                                            <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2">{category}</Button>
                                        ))}
                                    </div>

                                </>
                            )}
                            {activeTab === 'activity' && (
                                <>
                                    <h6 className="mb-3">최근 평가한 레시피</h6>
                                    <Row xs={2} md={3} lg={4} className="g-2 mb-4">
                                        {[...Array(8)].map((_, idx) => (
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
                                    <Row xs={2} md={3} lg={4} className="g-2 mb-4">
                                        {[...Array(8)].map((_, idx) => (
                                            <Col key={idx}>
                                                <div style={{
                                                    width: '100%',
                                                    paddingBottom: '100%',
                                                    background: '#f0f0f0'
                                                }}></div>
                                            </Col>
                                        ))}
                                    </Row>
                                    { <UserSelectedCategories categories={categories} userCategoryRecipes={userCategoryRecipes} /> }
                                    { (user.user_code <= 11 || user.chef_code === 1 )
                                        && <div>
                                                <h6 className="mb-3">최근 등록한 레시피</h6>
                                                {userMyRecipes && <UserMyRecipe recipes={userMyRecipes} />}
                                                {/* <Row xs={2} md={3} lg={4} className="g-2">
                                                    {[...Array(8)].map((_, idx) => (
                                                        <Col key={idx}>
                                                            <div style={{
                                                                width: '100%',
                                                                paddingBottom: '100%',
                                                                background: '#f0f0f0'
                                                            }}></div>
                                                        </Col>
                                                    ))}
                                                </Row> */}
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