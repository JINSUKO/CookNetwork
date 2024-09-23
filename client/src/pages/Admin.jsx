import React, {useCallback, useEffect, useState} from 'react';
import {Col, Container, Nav, Row, Tab} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faMessage, faTachometerAlt, faUsersCog} from '@fortawesome/free-solid-svg-icons';

import Dashboard from '../components/AdminDashboardContent.jsx';
import RecipeTable from '../components/AdminRecipeTable.jsx';
import {getRecipesCount} from '../components/DashboardAPI.jsx'

const AdminDashboard = () => {
    const API_URL = import.meta.env.VITE_HOST_IP;

    const [activeTab, setActiveTab] = useState('dashboard');
    // const [filter, setFilter] = useState([]);
    // const [sort, setSort] = useState('');
    // const [page, setPage] = useState(1);
    //
    // // todo 1. 레시피 테이블의 모든 정보가 나오게 수정 2. 필터, 정렬 기능 가능하게, 3. 각 레시피 마다 맵핑 테이블의 정보 모달로 보이게
    //
    // // admin 용으로 api 만들기.
    // // todo 1. 기본 한페이지 분량 요청해서 보여주고, 2. 무한 스크롤로 다음 페이지 계속 보여주고, 3. 카테고리나 정렬 선택 후 버튼 누르면 [1., 2.] 기능 다시 되게 하기.
    // const getRecipes = useCallback( async ({filter=[], sort='', page=1} = {}) => {
    //     let url = `${API_URL}/api/admin/recipes`;
    //
    //     try {
    //         // todo 필터로도 가져올 수있게 만들어야 해서,
    //         const response = await fetch(url);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }, [])
    //
    // // 처음 렌더링 일때 돌아가는 코드.
    // const getInitialData = async () => {
    //     let [recipes, allRecipesCounts] = await Promise.all([
    //         getRecipes({filter : filter, sort : sort, page : page}),
    //         // getRecipeCounts(),
    //     ])
    // }
    //
    // useEffect(() => {
    //     getInitialData();
    //
    //     // todo 버튼을 눌렀을 때 이 요청이 가게 만들어야함.
    //     // const recipes = await getRecipes();
    //     // const allRecipesCounts = await getRecipeCounts();
    //     // const adjustedRecipesCounts = await getRecipeCounts({filter : filter, sort : sort});
    //     // let [recipes, allRecipesCounts, adjustedRecipesCounts] = await Promise.all([
    //     //     getRecipes({filter : filter, sort : sort, page : page}),
    //     //     getRecipeCounts(),
    //     //     getRecipeCounts({filter : filter, sort : sort})
    //     // ])
    //
    // }, [])

    return (
        <Container fluid className="mt-4">
            <h1 className="mb-4">CookNetwork 관리자 대시보드</h1>

            <Tab.Container id="admin-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="dashboard">
                                    <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                                    Dashboard
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="recipes">
                                    <FontAwesomeIcon icon={faList} className="me-2" />
                                    Recipes
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="users">
                                    <FontAwesomeIcon icon={faUsersCog} className="me-2" />
                                    User Management
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="chats">`
                                    <FontAwesomeIcon icon={faMessage} className="me-2" />
                                    Chat Management
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="dashboard">
                                {/*
                                    todo 1. 시각화 그래프 만들어보기 2. api로 서버 데이터 가져와서 입히기.
                                */}
                                <h2>전체 관리</h2>
                                <p>여기서 모든 데이터 현황을 확인할 수 있습니다. 개발 중 입니다.</p>
                                <Dashboard activeTab={activeTab}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="recipes">
                                {/*
                                    todo 1. 무한 스크롤 만들기 2. 필터랑 정렬 적용하기
                                */}
                                <h2>레시피 관리</h2>
                                <p>여기서 모든 레시피를 관리할 수 있습니다. 개발 중 입니다.</p>
                                <RecipeTable activeTab={activeTab}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="users">
                                <h2>유저 관리</h2>
                                <p>여기서 모든 유저를 관리할 수 있습니다. 개발 중 입니다.</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="chats">
                                <h2>채팅 관리</h2>
                                <p>여기서 모든 채팅을 관리할 수 있습니다. 개발 중 입니다.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default AdminDashboard;