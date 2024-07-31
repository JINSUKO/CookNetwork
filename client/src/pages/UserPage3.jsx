import React from 'react';
import { Container, Row, Col, Nav, InputGroup, FormControl, Button, Card, Tabs, Tab } from 'react-bootstrap';

const UserPage = () => {
  return (
    <Container fluid>
      {/* Header */}
      <Row className="align-items-center my-3">
        <Col>
          <h1 className="display-6 fw-bold">COOKNET</h1>
        </Col>
        <Col xs="auto">
          <InputGroup>
            <FormControl placeholder="Value" aria-label="Value" />
            <Button variant="outline-secondary">x</Button>
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Nav>
            <Nav.Link>공지사항</Nav.Link>
            <Nav.Link>마이페이지</Nav.Link>
            <Nav.Link>로그아웃</Nav.Link>
          </Nav>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        {/* Left Column */}
        <Col md={6}>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item><Nav.Link active>한식</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>양식</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>일식&아시안</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>중식</Nav.Link></Nav.Item>
          </Nav>

          <div className="text-center mb-3">
            <div className="circle mb-2">
              <span>"프로필 사진"</span>
            </div>
            <h5>"닉네임"</h5>
            <div className="mb-2">
              <Button variant="outline-secondary" size="sm" className="me-2">프로필 보기</Button>
              <Button variant="outline-secondary" size="sm">내정보 보기</Button>
            </div>
            <Row className="justify-content-center g-2 mb-3">
              <Col xs="auto">
                <FormControl size="sm" placeholder="찜기한 레시피 수: 000" />
              </Col>
              <Col xs="auto">
                <FormControl size="sm" placeholder="찜한 식당 수: 000" />
              </Col>
            </Row>
            <div>
              {['Label', 'Label', 'Label'].map((label, idx) => (
                <Button key={idx} variant="dark" size="sm" className="me-1">{label}</Button>
              ))}
              {['Label', 'Label'].map((label, idx) => (
                <Button key={idx} variant="secondary" size="sm" className="me-1">{label}</Button>
              ))}
            </div>
          </div>
        </Col>

        {/* Right Column */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <Nav variant="tabs" defaultActiveKey="#first">
                <Nav.Item>
                  <Nav.Link href="#first">찜한명단</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#link">활동</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Card.Title>닉네임: "닉네임"</Card.Title>
              <Card.Text>
                성별: "성별"<br />
                이메일: "이메일"<br />
                유저 등급: "일반 유저"<br />
                유저 등급: "일반 유저"
              </Card.Text>
            </Card.Body>
          </Card>
          <div>
            <Button variant="dark" size="sm" className="me-1">카테고리 필터링</Button>
            <Button variant="dark" size="sm" className="me-1">카테고리 제거하기</Button>
          </div>
          <div className="mt-2">
            {['Label', 'Label', 'Label', 'Label', 'Label'].map((label, idx) => (
              <Button key={idx} variant="dark" size="sm" className="me-1">{label}</Button>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;