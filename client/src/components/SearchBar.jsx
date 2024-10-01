/* SearchBar.jsx 
사용자에게 검색어를 입력받아 검색 기능을 수행합니다.
메인 상단 검색창, 버튼은 부트스트랩을 사용하였습니다.
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import SearchCategoryDrop from "./SearchCategoryDrop";
import "../assets/styles/SearchBar.css"
import { FaSearch } from "react-icons/fa";

function SearchBar({ onSearch, recipeData }) {  
  const [searchInput, setSearchInput] = useState("") ; 
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [results, setResults] = useState([]);
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

  // 검색을 수행하는 handleSearch 함수
  const handleSearch = () => {
    const searchPath = selectedCategory === 'all'
      ? `/search?q=${encodeURIComponent(searchInput)}`   // 전체 카테고리 선택시
      : `/search?q=${encodeURIComponent(searchInput)}&category=${encodeURIComponent(selectedCategory)}`;
    
    navigate(searchPath);
    if (onSearch) {
      onSearch(searchInput, selectedCategory);
    }
    // handleFilter()
  };

  // submit(검색) 버튼 클릭시 이벤트 함수
  const handleSubmit = (event) => {   
    event.preventDefault();
    handleSearch();   // handleSearch를 호출하여 현재 검색어와 선택된 카테고리를 NavbarElement.jsx에 전달
  };
  
  /*
  검색어를 필터링할 handleFilter.
  -검색어와 같은 값들을 걸러내줄 filter 함수
  -배열의 특정 요소가 포함되는지 판별해주는 include 함수
  -toLocaleLowerCase 함수로 입력값과 제목을 소문자로 통일시킴. includes 함수는 대소문자를 인식(구분)하기 때문에 필요
  -공백 유무 상관없이 검색 가능하게 해줄 replace 함수
  */

  // useEffect(() => {
  //   handleFilter();
  // }, [searchInput, recipeData]);

  // const handleFilter = () => {
  //   if (!recipeData) return;    // 데이터가 없을 때에는 함수 실행안함
  //   const results = recipeData.filter((recipe) => recipe.recipe_name.replace(" ","").toLocaleLowerCase().includes(searchInput.toLocaleLowerCase().replace(" ",""))
  //   )
  //   setResults(results)
  //   console.log("results:", results)
  // };


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
          onClick={handleSearch}>
          <span className="search-icon"><FaSearch />
          </span>
        </Button>
      </Form>
    </div>
  )
}

export default SearchBar;