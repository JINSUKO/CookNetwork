import {Button, Card, Col, Row, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faExclamationCircle, faUsers, faUtensils} from "@fortawesome/free-solid-svg-icons";
import React, {useCallback, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";

import {getRecipesCount, getUsersCount} from "./DashboardAPI.jsx";

const AdminDashboardContent = ({activeTab}) => {

    const [allRecipesCounts, setAllRecipesCounts] = useState(null);
    const [allUserCounts, setAllUserCounts] = useState(null);

    // todo 1. 화면에 보이는 대쉬 보드 서버 API로 데이터 받아서 채우기. 2. 다른 거 뭐 채울지 고민... 3. 그래프 등 시각화 넣어보기?
    const getDashboardData = useCallback(async () => {
        setAllRecipesCounts(await getRecipesCount());
        setAllUserCounts(await getUsersCount());
    })

    useEffect(() => {
        if (activeTab === 'dashboard') {
            getDashboardData();
        }
    }, [activeTab]);


    return (
        <Container>
            <h2 className="mb-4">Dashboard Overview</h2>
            <Row>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUtensils} className="me-2"/>
                                레시피 전체 개수
                            </Card.Title>
                            <Card.Text className="h2">{allRecipesCounts}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUsers} className="me-2"/>
                                사용자 전체 수
                            </Card.Title>
                            <Card.Text className="h2">{allUserCounts}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faBook} className="me-2"/>
                                승인 대기 중
                            </Card.Title>
                            <Card.Text className="h2">추가 중...</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faExclamationCircle} className="me-2"/>
                                Reported Content
                            </Card.Title>
                            <Card.Text className="h2">추가 중...</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default React.memo(AdminDashboardContent);