import React from 'react';

function Board() {
  const posts = [
    { id: 1, title: '여름 특별 레시피 콘테스트 개최', content: '7월 1일부터 8월 15일까지 여름 특별 레시피 콘테스트를 개최합니다. 더위를 이기는 창의적인 레시피를 공유해주세요. 우승자에게는 고급 주방용품 세트를 드립니다!' },
    { id: 2, title: '사이트 개편 안내', content: '더 나은 서비스 제공을 위해 다음 주 화요일 새벽 2시부터 4시까지 사이트 개편 작업이 있을 예정입니다. 해당 시간 동안 서비스 이용이 제한되오니 양해 부탁드립니다.' },
    { id: 3, title: '신규 기능: 영양 정보 표시', content: '사용자 여러분의 요청에 따라 모든 레시피에 영양 정보 표시 기능을 추가했습니다. 이제 각 레시피의 칼로리, 단백질, 지방, 탄수화물 정보를 확인하실 수 있습니다.' },
  ];

  const API_URL = import.meta.env.VITE_HOST_IP; 

  return (
    <div>
      <h1>공지사항</h1>
      
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
            <p>{post.title}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;