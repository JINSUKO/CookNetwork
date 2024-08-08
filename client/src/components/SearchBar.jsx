/* SearchBar.jsx 
사용자에게 검색어를 입력받아 검색 기능을 수행합니다.
메인 상단 검색창, 버튼은 부트스트랩을 사용하였습니다.
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import SearchCategoryDrop from "./SearchCategoryDrop";
import "../assets/styles/SearchBar.css"

function SearchBar({ onSearch }) {    // onSearch를 prop으로 받기
  const [searchInput, setSearchInput] = useState("") ;    // useState 사용하여 검색한 키워드 저장
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate();

  // onChange 함수 
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);   // 입력된 검색어 값 저장
    console.log(searchInput)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);  // 선택한 카테고리 값 저장
    console.log(category)
  }

  // 검색을 수행하는 onSearch 함수
  const handleSearch = (event) => {
    navigate(`/search?q=${encodeURIComponent(searchInput)}&category=${encodeURIComponent(category)}`);
  };

  // submit(검색) 버튼 클릭시 이벤트 함수
  const handleSubmit = (event) => {   
    event.preventDefault();
    handleSearch();   // onSearch를 호출하여 현재 검색어와 선택된 카테고리를 NavbarElement.jsx에 전달
  };


  return(
    <div >
      <Form onSubmit={handleSubmit} className="search-form d-flex align-items-center" style={{ position: 'relative' }}>
        <SearchCategoryDrop onCategoryChange={handleCategoryChange}/>
        <Form.Control
          type="search"
          className="search-input"
          required
          value={searchInput}    // 검색한 키워드
          onChange={handleInputChange} 
          placeholder="레시피를 검색하세요"
          />
        <Button 
          type="submit" 
          variant="warning" 
          className="search-button"
          onSearch={handleSearch}>
          <span>검색</span>
        </Button>
      </Form>
    </div>
  )
}

export default SearchBar;