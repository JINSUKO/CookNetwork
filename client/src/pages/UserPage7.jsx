import React, { useState } from 'react';
import { Container, Row, Col, Nav, InputGroup, FormControl, Button, Card } from 'react-bootstrap';

const UserPage = () => {
  const [activeTab, setActiveTab] = useState('userInfo');

  return (
    <Container fluid className="p-3">
      {/* Header */}
      <header className="mb-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h1 className="display-6 fw-bold text-warning">COOKNET</h1>
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
        <Nav variant="tabs">
          <Nav.Item><Nav.Link>한식</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link>양식</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link>일식&아시안</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link>중식</Nav.Link></Nav.Item>
        </Nav>
      </header>

      {/* Main Content */}
      <Row className="g-4">
        {/* Left Column */}
        <Col md={4}>
          <div className="text-center">
            <div className="circle mb-3" style={{width: '150px', height: '150px', borderRadius: '50%', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
              <span>"프로필 사진"</span>
            </div>
            <h5 className="mb-3">"닉네임"</h5>
            <div className="mb-3">
              <Button variant="dark" size="sm" className="me-2 mb-2">프로필 수정하기</Button>
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
                  <Card.Title className="mb-3">닉네임: "닉네임"</Card.Title>
                  <Card.Text>
                    성별: "성별"<br />
                    이메일: "이메일"<br />
                    유저 등급: "일반 유저"
                  </Card.Text>
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