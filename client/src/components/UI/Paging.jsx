/** Pagination.jsx
 * 검색 결과 리스트에 적용될 페이지네이션 컴포넌트
 * react-js-pagination 라이브러리 사용
 * [ ] 전체 데이터 개수
 */
import React from 'react';
import Pagination from "react-js-pagination";
import { LuChevronLeft , LuChevronRight, LuChevronsLeft , LuChevronsRight  } from "react-icons/lu";
import styles from '../../assets/styles/Paging.module.css'

const Paging = ({ activePage, itemsCountPerPage, totalItemsCount, onChange }) => {

  return (
    <div className={styles.paginationWrapper}>
      <Pagination
        activePage={activePage}
        onChange={onChange}
        itemsCountPerPage={itemsCountPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={5}
        // pageCount={pageCount}
        // previousLabel="<"
        // nextLabel=">"
        itemClass={styles.pageItem}
        linkClass={styles.pageLink}
        activeClass={styles.active}
        activeLinkClass={styles.activeLink}
        firstPageText="&laquo;"
        lastPageText="&raquo;"
        prevPageText="&lsaquo;"
        nextPageText="&rsaquo;"
      />
    </div>
  );
};

export default Paging;

