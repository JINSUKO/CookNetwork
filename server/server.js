const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS 설정
app.use(cors());

// Body parser
app.use(express.json());

// API 라우트
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// 여기에 다른 API 라우트들을 추가합니다...

// 위에 해당하지 않는 모든
// API 404 에러 처리
app.use('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// 정적 파일 서빙 (프로덕션 모드)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, '../client')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));