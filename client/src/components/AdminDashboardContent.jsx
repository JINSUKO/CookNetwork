import {Button, Card, Col, Row, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faExclamationCircle, faUsers, faUtensils} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Container from "react-bootstrap/Container";

const AdminDashboardContent = () => {

    return (
        <Container>
            <h2 className="mb-4">Dashboard Overview</h2>
            <Row>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUtensils} className="me-2"/>
                                Total Recipes
                            </Card.Title>
                            <Card.Text className="h2">1,234</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUsers} className="me-2"/>
                                Total Users
                            </Card.Title>
                            <Card.Text className="h2">5,678</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faBook} className="me-2"/>
                                Pending Approvals
                            </Card.Title>
                            <Card.Text className="h2">42</Card.Text>
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
                            <Card.Text className="h2">7</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboardContent;