/* 메인 상단 검색창 컴포넌트
부트스트랩 버튼 사용
*/

import React, { useState } from "react"
import Button from 'react-bootstrap/Button';


const SearchBar = ({handleSearch}) => {
  const [searchKeyword, setSearchKeyword] = useState("") ;
  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchKeyword);
  };

  return(
    <div>
      <form onSubmit={handleSubmit} className="">
        <input 
          className=""
          required
          onChange={(event) => setSearchKeyword(event.target.value)}
          type="text"
          placeholder="검색어를 입력하세요"/>
        <Button as="input" type="submit" value="검색"></Button>
      </form>
    </div>
  )
}

export default SearchBar;
