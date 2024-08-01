/* SearchBar.jsx 
검색창 컴포넌트 중 자식 컴포넌트에 해당합니다.

메인 상단 검색창 컴포넌트.부트스트랩 버튼 사용
=> 내비게이션바에 포함된 검색창으로 대체할수도?

검색어와 같은 값들을 걸러내기 -> filter 함수 사용

[ ] 상위,하위 컴포넌트로 나누기 -> prop-types 라이브러리?
[ ] function으로 수정

참고: https://velog.io/@jahommer/React-%EA%B2%80%EC%83%89%EC%B0%BD-%EB%A7%8C%EB%93%A4%EA%B8%B0
*/

import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Data from "./Data";

console.log(Data)

const SearchBar = ({handleSearch}) => {
  // useState hooks
  const [search, setSearch] = useState("") ;

  // 검색버튼 submit 함수
  const handleSubmit = (event) => {
    event.preventDefault();   // 제출 방지
    handleSearch(search);
  };

  // recipe 데이터 선언??
  const recipes = []   // 레시피 데이터를 여기에 넣으면 되나??

  // 검색어와 같은 값들을 걸러내줄 filter 함수
  // 배열의 특정 요소가 포함되는지 판별해주는 include 함수
  const filterTitle = recipes.filter((props) => {     // 인자값은 임의로 설정
    return props.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())   // toLocaleLowerCase 함수로 입력값과 제목을 소문자로 통일시킴. includes 함수는 대소문자를 인식(구분)하기 때문에 필요
  });

  // 공백 유무 상관없이 검색 가능하게 해줄 replace 함수 추가
  const replaceTitle = recipes.filter((props) => {
    return props.title.replace(" ","").toLcaleLowerCase().includes(search.toLocaleLowerCase().replace(" ",""))
  });

  return(
    <div>
      <form onSubmit={handleSubmit} className="search-form">
        <input 
          className="search-input"
          required
          onChange={(event) => setSearch(event.target.value)}

          {...Data.filter((props) => {   // Data 임포트 가능한지?? 오류뜸
            return props.title.replace(" ","").toLocaleLowerCase().includes(search.toLocaleLowerCase()) //수정필요
          })}

          type="text"
          placeholder=""/>
        <Button as="input" type="submit" value="검색" className="search-button"></Button>
      </form>
    </div>
  )
}

export default SearchBar;