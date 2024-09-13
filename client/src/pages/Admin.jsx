import React, {useState} from 'react';
import {Col, Container, Nav, Row, Tab} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faMessage, faTachometerAlt, faUsersCog} from '@fortawesome/free-solid-svg-icons';

import Dashboard from '../components/AdminDashboardContent.jsx';
import RecipeTable from "../components/AdminRecipeTable.jsx";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const recipes = [
        {id: 1, title: "Spicy Kimchi Stew", author: "Kim Minseo", status: "Approved"},
        {id: 2, title: "Bulgogi", author: "Lee Jiwon", status: "Pending"},
        {id: 3, title: "Bibimbap", author: "Park Sunjae", status: "Rejected"},
    ];

    return (
        <Container fluid className="mt-4">
            <h1 className="mb-4">Recipe Sharing Admin Dashboard</h1>

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
                                <h2>Comprehensive Management</h2>
                                <p>Here you can view comprehensive recipe management. This section is under construction.</p>
                                <Dashboard />
                            </Tab.Pane>
                            <Tab.Pane eventKey="recipes">
                                {/*
                                    todo 1. 무한 스크롤 만들기 2. 필터랑 정렬 적용하기
                                */}
                                <h2>Recipe Management</h2>
                                <p>Here you can manage all recipes. This section is under construction.</p>
                                <RecipeTable recipes={recipes} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="users">
                                <h2>User Management</h2>
                                <p>Here you can manage all users. This section is under construction.</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="chats">
                                <h2>Chat Management</h2>
                                <p>Here you can manage all chat rooms and messages. This section is under construction.</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
};

export default AdminDashboard;