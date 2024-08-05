/*
기존 components/SearchResultPage.jsx에 loader 기능을 적용
*/

import React from "react";
import { useLoaderData } from "react-router-dom";
import SearchResult from "../components/FilteredResult";

function SearchResultPage() {
  const { results, error } = useLoaderData();

  return(
    <div className="search-result-page">
      <h3>검색 결과</h3>
      <SearchResult results={results} error={error} />
    </div>
  )
}

export default SearchResultPage;