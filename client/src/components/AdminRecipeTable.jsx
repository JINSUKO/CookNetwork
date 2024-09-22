import React, { useCallback, useEffect, useRef, useState } from "react";
import {Button, Card, Container, Form} from "react-bootstrap";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

import AdminStyle from "../assets/styles/Admin.module.css";

import { getRecipes, getRecipesCount } from "./DashboardAPI.jsx"
import ScrollableDropdown from "./ScrollableDropdown.jsx";

const RecipeTable = ({ activeTab }) => {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState({});
    const [filter, setFilter] = useState([]);
    const [sort, setSort] = useState({});
    const [totalRecipesCount, setTotalRecipesCount] = useState(0);
    const [totalWidth, setTotalWidth] = useState(0);
    const [isRecipesLoading, setIsRecipesLoading] = useState(false);

    const currentPage = useRef(1);
    const ITEMS_PER_PAGE = 1;
    const ITEM_SIZE = 70;

    const searchKey = useRef(null);
    const searchValue = useRef(null);
    const filterCategory = useRef(null);
    const filterTag = useRef(null);
    const sortValue = useRef(null);

    const dropdownSearch = [
        "검색", "레시피 번호", "작성자", "유저 아이디", "레시피 이름", "레시피 설명", "레시피 재료"
    ];

    const dropdownCategories = [
        "전체", "한식", "양식", "중식", "일식"
    ];

    const dropdownTags = [
        "모두보기", "메인요리", "반찬", "국/탕", "디저트", "면",
        "밥/죽/떡", "퓨전", "양념/소스", "채식", "분식", "안주",
        "스프", "간식", "음료", "다이어트", "도시락"
    ];

    const dropdownOrders = [
        "정렬", "오래된 순", "최근 순", "작성자(오름차순)", "작성자(내림차순)",
        "레시피 번호(오름차순)", "레시피 번호(내림차순)", "레시피 이름(오름차순)", "레시피 이름(내림차순)"
    ];

    const handleSearchInputChange = (event) => {
        searchValue.current = event.target.value;
        console.log(searchValue.current);
    }

    const confirmSearch = async () => {
        if ((searchKey.current && searchValue.current) || filterCategory.current || filterTag.current || sortValue.current) {

            const dropdownSearchColumns = [
                "Recipe Id", "Author", "User Id", "Recipe Name", "Recipe Description", "Recipe Ingredients"
            ];

            let tmpSearch = {};
            if (searchKey.current && searchValue.current) {
                tmpSearch = dropdownSearch.map((search, index) => {
                    if (search === searchKey.current) {
                        // 레시피 번호일 때는 숫자반 검색할 수 있게 제한한다.
                        if ((index - 1) === 0 && !Number(searchValue.current)) {
                            return alert('레시피 번호는 숫자로 입력해주세요.');
                        }
                        return {[dropdownSearchColumns[index - 1]]: searchValue.current}
                    }
                }).filter(element => element)[0];
                
                // 검색어가 올바르지않으면 값을 받지 않기 때문에 여기서 null/undefined 체크를 한다.
                if (!tmpSearch) return;
            }
            setSearch(tmpSearch);

            const tmpFilters = [];
            if (filterCategory.current) tmpFilters.push(filterCategory.current);
            if (filterTag.current) tmpFilters.push(filterTag.current);
            setFilter(tmpFilters);

            const dropdownOrderColumns = [
                "Created Date", "User Id", "Recipe Id", "Recipe Name"
            ];

            let tmpSort = {};
            if (sortValue.current) {
                tmpSort = dropdownOrders.map((key, index) => {
                    if (key === sortValue.current) {
                        if ((index - 1) % 2) {
                            return {DESC:dropdownOrderColumns[Math.floor((index - 1) / 2)]};
                        } else {
                            return {ASC:dropdownOrderColumns[Math.floor((index - 1) / 2)]};
                        }
                    }
                }).filter(element => element)[0];
            }
            setSort(tmpSort);

            try {
                const newRecipes = await getRecipes({ search: tmpSearch, filter: tmpFilters, sort: tmpSort, recipePerPage: ITEMS_PER_PAGE});
                setRecipes(newRecipes);
                currentPage.current = 1;
            } catch (e) {
                console.error(e);
            }
        }
    }

    const loadMoreRecipes = useCallback(async (startIndex, stopIndex) => {
        console.log('startIndex', startIndex);
        console.log('stopIndex', stopIndex);

        if (isRecipesLoading) return;

        setIsRecipesLoading(true);

        const page = Math.floor(startIndex / ITEMS_PER_PAGE) + 1;
        console.log('page',page)
        console.log('currentPage.current', currentPage.current)

        console.log(search, filter, sort)

        if (page > currentPage.current - 1) {
            try {
                const newRecipes = await getRecipes({ search, filter, sort, recipePerPage: ITEMS_PER_PAGE, page});
                setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]);
                currentPage.current = page;
            } catch (e) {
                console.error(e);
            } finally {
                setIsRecipesLoading(false);
            }
        } else {
            setIsRecipesLoading(false);
        }
    }, [filter, sort, isRecipesLoading, recipes.length])

    const isItemLoaded = useCallback((index) => (index < recipes.length), [recipes]);

    useEffect(() => {
        console.log(activeTab)
        if (activeTab === 'recipes') {
            loadMoreRecipes(0, ITEMS_PER_PAGE);
            getRecipesCount()
                .then((count) => { setTotalRecipesCount(count); })
                .catch((e) => { console.error(e); });
        }

        return () => {
            // RecipeTable 컴포너트가 unmount 되면 상태 저장하던 값들을 모두 초기화 한다.
            setRecipes([]);
            currentPage.current = 1;
            setSearch({});
            setFilter([]);
            setSort({});
            searchKey.current = null;
            searchValue.current = null;
            filterCategory.current = null;
            filterTag.current = null;
            sortValue.current = null;
        }
    }, [activeTab]);

    const headerColumns = [
        { key: 'Recipe Id', width: 100 },
        { key: 'Author', width: 130 },
        { key: 'User Id', width: 100 },
        { key: 'Recipe Name', width: 200 },
        { key: 'Recipe Image', width: 150 },
        { key: 'Recipe Description', width: 300 },
        { key: 'Recipe Categories', width: 200 },
        { key: 'Recipe Ingredients', width: 300 },
        { key: 'Cooked Orders', width: 300 },
        { key: 'Cooked Time', width: 120 },
        { key: 'Serving', width: 80 },
        { key: 'Level', width: 60 },
        { key: 'Tips', width: 50 },
        { key: 'Created Date', width: 200 },
        { key: 'Last Updated Date', width: 200 },
        { key: 'Post Type', width: 100 },
        { key: 'Bookmark Counts', width: 160 }
    ];

    useEffect(() => {
        const width = headerColumns.reduce((acc, column) => acc + column.width, 0);
        setTotalWidth(width);
    }, []);

    const RecipeRow = React.memo(({ index, style }) => {
        const recipe = recipes[index];
        if (!recipe) {
            return <div style={style}>
                <div>more...</div>
            </div>;
            // return ;
        }

        return (
            <div style={{...style, width: `${totalWidth}px`}} className={AdminStyle.tableRow}>
                <div style={{width: `${headerColumns[0].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Recipe Id']}</div>
                <div style={{width: `${headerColumns[1].width}px`}} className={AdminStyle.tableCell}>{recipe['Author']}</div>
                <div style={{width: `${headerColumns[2].width}px`}} className={AdminStyle.tableCell}>{recipe['User Id']}</div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeName}`}>
                    <span className={AdminStyle.nameTruncated}>{recipe['Recipe Name']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Recipe Name']}</span>
                </div>
                <div style={{width: `${headerColumns[4].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Recipe Image']}</div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeDescription}`}>
                    <span className={AdminStyle.descTruncated}>{recipe['Recipe Description']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Recipe Description']}</span>
                </div>
                <div style={{width: `${headerColumns[6].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Recipe Categories']}</div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeDescription}`}>
                    <span className={AdminStyle.truncated}>{recipe['Recipe Ingredients']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Recipe Ingredients']}</span>
                </div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeDescription}`}>
                    <span className={AdminStyle.truncated}>{recipe['Cooked Orders']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Cooked Orders']}</span>
                </div>
                <div style={{width: `${headerColumns[9].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Cooked Time']}</div>
                <div style={{width: `${headerColumns[10].width}px`}} className={AdminStyle.tableCell}>{recipe['Serving']}</div>
                <div style={{width: `${headerColumns[11].width}px`}} className={AdminStyle.tableCell}>{recipe['Level']}</div>
                <div style={{width: `${headerColumns[12].width}px`}} className={AdminStyle.tableCell}>{recipe['Tips']}</div>
                <div style={{width: `${headerColumns[13].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Created Date']}</div>
                <div style={{width: `${headerColumns[14].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Last Updated Date']}</div>
                <div style={{width: `${headerColumns[15].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Post Type']}</div>
                <div style={{width: `${headerColumns[16].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Bookmark Counts']}</div>
            </div>
        );
    });

    return (
        <Card>
            <Card.Header className={AdminStyle.cardHeader} as="h5">
                Recent Recipes &nbsp;
                {activeTab === 'recipes' && (
                    <>  <ScrollableDropdown items={dropdownSearch} ref={searchKey} activeTab={activeTab}/> &nbsp;
                        <Form.Control style={{width: '100px'}} onChange={handleSearchInputChange}/>
                        &nbsp;|&nbsp; <ScrollableDropdown ref={filterCategory} items={dropdownCategories} activeTab={activeTab}/>
                        &nbsp;|&nbsp; <ScrollableDropdown ref={filterTag} items={dropdownTags} activeTab={activeTab}/>
                        &nbsp;|&nbsp; <ScrollableDropdown ref={sortValue} items={dropdownOrders} activeTab={activeTab}/>
                        &nbsp; <Button onClick={confirmSearch}>확인</Button>
                    </> )}
            </Card.Header>
            <Card.Body>
                <div className={AdminStyle.tableContainer}>
                    <Container fluid>
                        <div className={AdminStyle.tableHeader}>
                            {headerColumns.map(column => (
                                <div key={column.key} className={AdminStyle.headerCell}
                                     style={{width: column.width, backgroundColor: '#f8f9fa'}}>
                                    {column.key}
                                </div>
                            ))}
                        </div>
                        <div className={AdminStyle.tableBody}>
                            <InfiniteLoader
                                isItemLoaded={isItemLoaded}
                                itemCount={totalRecipesCount}
                                loadMoreItems={loadMoreRecipes}
                            >
                                {({onItemsRendered, ref}) => (
                                    <FixedSizeList
                                        className={AdminStyle.tableContentContainer}
                                        height={700}
                                        itemCount={totalRecipesCount}
                                        itemSize={ITEM_SIZE}
                                        width={totalWidth}
                                        onItemsRendered={onItemsRendered}
                                        ref={ref}
                                    >
                                        {RecipeRow}
                                    </FixedSizeList>
                                )}
                            </InfiniteLoader>
                        </div>
                    </Container>
                </div>
            </Card.Body>
        </Card>
    );
};

export default React.memo(RecipeTable);