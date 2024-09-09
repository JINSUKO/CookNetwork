/** Loading.jsx
 */

import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Container } from 'react-bootstrap';

const Loading = () => {
  const loadingStyle = {
    backgroundColor: '#ffffff',
    padding: '4rem 0 2rem 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'  // 최소 높이 설정
  };
  
  return (
    <Container style={loadingStyle}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">로딩중</span>
      </Spinner>
    </Container>
  );
};

export default Loading;