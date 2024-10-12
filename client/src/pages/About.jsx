import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaChevronRight} from '@react-icons/all-files/fa/FaChevronRight';
import { FaCookie} from '@react-icons/all-files/fa/FaCookie';
import { FaCookieBite } from '@react-icons/all-files/fa/FaCookieBite';

function About () {
  return (
    <div className="d-flex flex-column align-items-center min-vh-100 justify-content-center">
      <Container style={{ maxWidth: '600px' }}>
        <Row className="my-3">
          <Col>
            <nav className="text-sm mb-4">
              <span>Home</span>
              <FaChevronRight className="mx-1" size={10} />
              <span>서비스 소개</span>
              <hr/>
            </nav>
          </Col>
        </Row>

        <Row className="my-5 text-center">
          <Col>
            <h4 className="display-4 mb-2"  style={{ fontWeight: 'bold' }}><i>CookNetWork를 소개합니다!</i></h4>
            <p className="mb-4">
            'CookNetwork'는 요리를 사랑하는 모든 이들을 위한 온라인 커뮤니티입니다.
              초보자부터 전문가까지, 요리사들이 레시피를 공유하고, 배우며, 함께 성장할 수 있는 레시피 공유 플랫폼입니다.
            </p>
            <div className="mb-4">
            <FaCookie /><FaCookieBite /><FaCookie />
            </div>
          </Col>
        </Row>
        <Row className="my-5">
          <Col>
            <h2 className="h3 mb-3 text-center" style={{ fontWeight: 'bold' }}>우리 사이트의 특징</h2>
            <h5 className="h4 mb-3" style={{ fontWeight: 'bold' }}>1. 다양한 레시피</h5>
              <ul>
                <li>전 세계의 다양한 요리법을 한곳에서 만나보세요.</li>
                <li>식사 유형, 요리 시간, 난이도 등 다양한 카테고리로 쉽게 검색해보세요.</li>
                <li>AI를 통해 음식 사진으로 레시피를 검색하고 추천을 받아보세요.</li>
              </ul>
            <h5 className="h4 mb-3" style={{ fontWeight: 'bold' }}>2. 나만의 레시피 공유</h5>
              <ul>
                <li>여러분만의 특별한 레시피를 사람들과 공유하세요.</li>
              </ul>
            <h5 className="h4 mb-3" style={{ fontWeight: 'bold' }}>3. 실시간 커뮤니티</h5>
              <ul>
                <li>좋아하는 레시피에 관하여 셰프에게 직접 질문해보세요.</li>
                <li>여러분의 레시피에 관하여 대화해보세요.</li>
              </ul>
          </Col>
        </Row>
        <Row className="my-5">
          <Col>
            <h2 className="h3 mb-3 text-center" style={{ fontWeight: 'bold' }}>함께 요리의 세계를 탐험해요!</h2>
            <p>
              여러분의 주방에서 시작되는 모험을 응원합니다. 우리와 함께 요리의 즐거움을 나누고, 새로운 맛의 세계를 탐험해보세요!
            </p>
          </Col>
        </Row>
        <Row className="my-4">
          <img src='https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?t=st=1727763099~exp=1727766699~hmac=296368806dc6d5e9071cd7404646884915ffe46ad698ccfc32959812ecb6dbec&w=1060' alt='음식 사진'></img>
        </Row>
      </Container>
    </div>
  );
};

export default About;