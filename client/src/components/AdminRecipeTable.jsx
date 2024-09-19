// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Card, Container } from "react-bootstrap";
// import { FixedSizeList } from "react-window";
// import InfiniteLoader from "react-window-infinite-loader";
//
// import AdminStyle from "../assets/styles/Admin.module.css";
//
// import { getRecipes, getRecipesCount } from "./DashboardAPI.jsx"
//
//
// const RecipeTable = ({ activeTab }) => {
//
//     const [recipes, setRecipes] = useState([]);
//     const [filter, setFilter] = useState([]);
//     const [sort, setSort] = useState('');
//     // const [currentPage, setCurrentPage] = useState(1);
//     const [totalRecipesCount, setTotalRecipesCount] = useState(0);
//     const [totalWidth, setTotalWidth] = useState(0);
//     const [isRecipesLoading, setIsRecipesLoading] = useState(false); // 요청 중 여부를 관리하는 상태
//
//     const currentPage = useRef(1);
//     const tableRef = useRef(null);
//     const headerRef = useRef(null);
//
//     const ITEMS_PER_PAGE = 3;
//
//     const loadMoreRecipes = useCallback(async (startIndex, stopIndex) => {
//         console.log('startIndex', startIndex);
//         console.log('stopIndex', stopIndex);
//
//         if (isRecipesLoading) return; // 이미 로딩 중이면 중단
//
//         setIsRecipesLoading(true); // 로딩 시작
//
//         const page = Math.floor(startIndex / ITEMS_PER_PAGE) + 1;
//
//         if (page > currentPage.current - 1) {
//             try {
//                 const newRecipes = await getRecipes({ filter, sort, recipePerPage: ITEMS_PER_PAGE, page});
//                 setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]);
//                 // setCurrentPage(page);
//                 currentPage.current = page;
//             } catch (e) {
//                 console.error(e);
//             } finally {
//                 setIsRecipesLoading(false); // 로딩 완료 후 상태 초기화
//             }
//         } else {
//             setIsRecipesLoading(false); // 페이지가 작으면 로딩 완료
//         }
//     }, [filter, sort, isRecipesLoading])
//
//     const isItemLoaded = useCallback((index) => (index < recipes.length), [recipes]);
//
//     useEffect(() => {
//         if (activeTab === 'recipes') {
//             loadMoreRecipes(0, ITEMS_PER_PAGE);
//             getRecipesCount()
//                 .then((count) => { setTotalRecipesCount(count); })
//                 .catch((e) => { console.error(e); });
//         }
//
//         // Cleanup function: 언마운트될 때 실행
//         return () => {
//             setRecipes([]);
//             currentPage.current = 1;
//         }
//     }, [activeTab]);
//
//     const columns = [
//         { key: 'Recipe Id', width: 100 },
//         { key: 'Author', width: 130 },
//         { key: 'User Id', width: 100 },
//         { key: 'Recipe Name', width: 200 },
//         { key: 'Recipe Image', width: 150 },
//         { key: 'Recipe Description', width: 300 },
//         { key: 'Recipe Categories', width: 200 },
//         { key: 'Cooked Time', width: 120 },
//         { key: 'Serving', width: 80 },
//         { key: 'Level', width: 60 },
//         { key: 'Tips', width: 50 },
//         { key: 'Created Date', width: 200 },
//         { key: 'Last Updated Date', width: 200 },
//         { key: 'Post Type', width: 100 },
//         { key: 'Bookmark Counts', width: 160 }
//     ];
//
//     useEffect(() => {
//         const width = columns.reduce((acc, column) => acc + column.width, 0);
//         setTotalWidth(width);
//     }, []);
//
//     const RecipeRow = React.memo(({ index, style }) => {
//         const recipe = recipes[index];
//         if (!recipe) {
//             return <div style={style}><div>Loading...</div></div>;
//         }
//
//         return (
//             <div style={{...style, width: `${totalWidth}px`}} className={AdminStyle.tableRow}>
//                 <div style={{width: `${columns[0].width}px`}} className={AdminStyle.tableCell} >{recipe['Recipe Id']}</div>
//                 <div style={{width: `${columns[1].width}px`}} className={AdminStyle.tableCell}>{recipe['Author']}</div>
//                 <div style={{width: `${columns[2].width}px`}} className={AdminStyle.tableCell}>{recipe['User Id']}</div>
//                 <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeName}`}>
//                     <span className={AdminStyle.truncated}>{recipe['Recipe Name']}</span>
//                     <span className={AdminStyle.tooltipText}>{recipe['Recipe Name']}</span>
//                 </div>
//                 <div style={{width: `${columns[4].width}px`}} className={AdminStyle.tableCell}>{recipe['Recipe Image']}</div>
//                 <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeDescription}`}>
//                     <span className={AdminStyle.truncated}>{recipe['Recipe Description']}</span>
//                     <span className={AdminStyle.tooltipText}>{recipe['Recipe Description']}</span>
//                 </div>
//                 <div style={{width: `${columns[6].width}px`}} className={AdminStyle.tableCell}>{recipe['Recipe Categories']}</div>
//                 <div style={{width: `${columns[7].width}px`}} className={AdminStyle.tableCell}>{recipe['Cooked Time']}</div>
//                 <div style={{width: `${columns[8].width}px`}} className={AdminStyle.tableCell}>{recipe['Serving']}</div>
//                 <div style={{width: `${columns[9].width}px`}} className={AdminStyle.tableCell}>{recipe['Level']}</div>
//                 <div style={{width: `${columns[10].width}px`}} className={AdminStyle.tableCell}>{recipe['Tips']}</div>
//                 <div style={{width: `${columns[11].width}px`}} className={AdminStyle.tableCell}>{recipe['Created Date']}</div>
//                 <div style={{width: `${columns[12].width}px`}} className={AdminStyle.tableCell}>{recipe['Last Updated Date']}</div>
//                 <div style={{width: `${columns[13].width}px`}} className={AdminStyle.tableCell}>{recipe['Post Type']}</div>
//                 <div style={{width: `${columns[14].width}px`}} className={AdminStyle.tableCell}>{recipe['Bookmark Counts']}</div>
//             </div>
//         );
//     });
//
//     return (
//         <Card>
//             <Card.Header as="h5">Recent Recipes</Card.Header>
//             <Card.Body>
//                 <div className={AdminStyle.tableContainer} ref={tableRef}>
//                     <Container fluid>
//                         <div className={AdminStyle.tableHeader} ref={headerRef}>
//                             {columns.map(column => (
//                                 <div key={column.key} className={AdminStyle.headerCell} style={{ width: column.width, backgroundColor: '#f8f9fa'}}>
//                                     {column.key}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className={AdminStyle.tableBody}>
//                             <InfiniteLoader
//                                 isItemLoaded={isItemLoaded}
//                                 itemCount={totalRecipesCount}
//                                 loadMoreItems={loadMoreRecipes}
//                             >
//                                 {({ onItemsRendered, ref }) => (
//                                     <FixedSizeList
//                                         height={500}
//                                         itemCount={totalRecipesCount}
//                                         itemSize={80}
//                                         onItemsRendered={onItemsRendered}
//                                         ref={ref}
//                                         width={totalWidth}
//                                         // style={{width: `${totalWidth}px`}}
//                                     >
//                                         {RecipeRow}
//                                     </FixedSizeList>
//                                 )}
//                             </InfiniteLoader>
//                         </div>
//                     </Container>
//                 </div>
//             </Card.Body>
//         </Card>
//     );
// };
//
// export default RecipeTable;


import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

import AdminStyle from "../assets/styles/Admin.module.css";

import { getRecipes, getRecipesCount } from "./DashboardAPI.jsx"

const RecipeTable = ({ activeTab }) => {
    const [recipes, setRecipes] = useState([]);
    const [filter, setFilter] = useState([]);
    const [sort, setSort] = useState('');
    const [totalRecipesCount, setTotalRecipesCount] = useState(0);
    const [totalWidth, setTotalWidth] = useState(0);
    const [isRecipesLoading, setIsRecipesLoading] = useState(false);

const [currentIndex, setCurrentIndex] = useState(0);  // 현재 인덱스를 저장하는 상태
    const listRef = useRef(null); // FixedSizeList의 ref

    const currentPage = useRef(1);
    const tableRef = useRef(null);
    const headerRef = useRef(null);
    const ITEMS_PER_PAGE = 3;
    const ITEM_SIZE = 110;

    const loadMoreRecipes = useCallback(async (startIndex, stopIndex) => {
        console.log('startIndex', startIndex);
        console.log('stopIndex', stopIndex);

        if (isRecipesLoading) return;

        setIsRecipesLoading(true);

        const page = Math.floor(startIndex / ITEMS_PER_PAGE) + 1;
        console.log('page',page)
        console.log('currentPage.current', currentPage.current)

        if (page > currentPage.current - 1) {
            try {
                const newRecipes = await getRecipes({ filter, sort, recipePerPage: ITEMS_PER_PAGE, page});
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
    }, [filter, sort, isRecipesLoading])

    const isItemLoaded = useCallback((index) => (index < recipes.length), [recipes]);

    useEffect(() => {
        if (activeTab === 'recipes') {
            loadMoreRecipes(0, ITEMS_PER_PAGE);
            getRecipesCount()
                .then((count) => { setTotalRecipesCount(count); })
                .catch((e) => { console.error(e); });
        }

        return () => {
            setRecipes([]);
            currentPage.current = 1;
            tableRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const columns = [
        { key: 'Recipe Id', width: 100 },
        { key: 'Author', width: 130 },
        { key: 'User Id', width: 100 },
        { key: 'Recipe Name', width: 200 },
        { key: 'Recipe Image', width: 150 },
        { key: 'Recipe Description', width: 300 },
        { key: 'Recipe Categories', width: 200 },
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
        const width = columns.reduce((acc, column) => acc + column.width, 0);
        setTotalWidth(width);
    }, []);

    // tableContainer 스크롤에 따라 startIndex를 계산하여 loadMoreRecipes 호출
    const handleContainerScroll = (e) => {
        // todo 높이의 값을 적절하게 나눠서 페이지 요청을 보내야한다.
        console.log('e.target.scrollTop', e.target.scrollTop)
        // if (Math.ceil((e.target.scrollTop/ITEM_SIZE) % 3) === 1 && (Math.ceil((e.target.scrollTop/ITEM_SIZE) % 3) + 1 > currentPage.current)) {
        //     // console.log(currentPage)
        //     loadMoreRecipes(Math.ceil((e.target.scrollTop/ITEM_SIZE) % 3) * 3, currentIndex + ITEMS_PER_PAGE);
        // }
        console.log(Math.ceil((e.target.scrollTop/ITEM_SIZE)) + 1 );
        console.log('currentPage.current',currentPage.current)
        // if ((Math.ceil((e.target.scrollTop/ITEM_SIZE)) + 1 > currentPage.current) && totalRecipesCount > Math.ceil((e.target.scrollTop/ITEM_SIZE)) * 3) {
        //     // console.log(currentPage)
        //     loadMoreRecipes(Math.ceil((e.target.scrollTop/ITEM_SIZE)) * 3, totalRecipesCount);
        // }
        if ((Math.floor(Math.ceil(e.target.scrollTop/ITEM_SIZE)) + 1 > currentPage.current) && totalRecipesCount > Math.ceil((e.target.scrollTop/ITEM_SIZE)) * ITEMS_PER_PAGE) {
            // console.log(currentPage)
            loadMoreRecipes(Math.ceil((e.target.scrollTop/ITEM_SIZE)) * ITEMS_PER_PAGE, totalRecipesCount);
        }
    };

    // InfiniteLoader로부터 전달받는 onScroll 이벤트에서 startIndex 계산
    const handleListScroll = ({ scrollOffset }) => {
        if (tableRef.current) {
            tableRef.current.scrollTop = scrollOffset;  // tableContainer와 동기화
        }
    };


    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (tableRef.current && listRef.current) {
    //             tableRef.current.scrollLeft = listRef.current.state.scrollOffset;
    //         }
    //     };
    //
    //     const listElement = listRef.current?._outerRef;
    //     if (listElement) {
    //         listElement.addEventListener('scroll', handleScroll);
    //         return () => listElement.removeEventListener('scroll', handleScroll);
    //     }
    // }, []);

    const RecipeRow = React.memo(({ index, style }) => {
        const recipe = recipes[index];
        if (!recipe) {
            return <div style={style}><div>Loading...</div></div>;
            // return ;
        }
        console.log(recipe)
        console.log(recipes)
        return (
            <div style={{...style, width: `${totalWidth}px`}} className={AdminStyle.tableRow}>
                <div style={{width: `${columns[0].width}px`}} className={AdminStyle.tableCell} >{recipe['Recipe Id']}</div>
                <div style={{width: `${columns[1].width}px`}} className={AdminStyle.tableCell}>{recipe['Author']}</div>
                <div style={{width: `${columns[2].width}px`}} className={AdminStyle.tableCell}>{recipe['User Id']}</div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeName}`}>
                    <span className={AdminStyle.truncated}>{recipe['Recipe Name']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Recipe Name']}</span>
                </div>
                <div style={{width: `${columns[4].width}px`}} className={AdminStyle.tableCell}>{recipe['Recipe Image']}</div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeDescription}`}>
                    <span className={AdminStyle.truncated}>{recipe['Recipe Description']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Recipe Description']}</span>
                </div>
                <div style={{width: `${columns[6].width}px`}} className={AdminStyle.tableCell}>{recipe['Recipe Categories']}</div>
                <div style={{width: `${columns[7].width}px`}} className={AdminStyle.tableCell}>{recipe['Cooked Time']}</div>
                <div style={{width: `${columns[8].width}px`}} className={AdminStyle.tableCell}>{recipe['Serving']}</div>
                <div style={{width: `${columns[9].width}px`}} className={AdminStyle.tableCell}>{recipe['Level']}</div>
                <div style={{width: `${columns[10].width}px`}} className={AdminStyle.tableCell}>{recipe['Tips']}</div>
                <div style={{width: `${columns[11].width}px`}} className={AdminStyle.tableCell}>{recipe['Created Date']}</div>
                <div style={{width: `${columns[12].width}px`}} className={AdminStyle.tableCell}>{recipe['Last Updated Date']}</div>
                <div style={{width: `${columns[13].width}px`}} className={AdminStyle.tableCell}>{recipe['Post Type']}</div>
                <div style={{width: `${columns[14].width}px`}} className={AdminStyle.tableCell}>{recipe['Bookmark Counts']}</div>
            </div>
        );
    });

    return (
        <Card>
            <Card.Header as="h5">Recent Recipes</Card.Header>
            <Card.Body>
                <div className={AdminStyle.tableContainer} ref={tableRef} onScroll={handleContainerScroll}>
                    <Container fluid>
                        <div className={AdminStyle.tableHeader} ref={headerRef}>
                            {columns.map(column => (
                                <div key={column.key} className={AdminStyle.headerCell} style={{ width: column.width, backgroundColor: '#f8f9fa'}}>
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
                                {({ onItemsRendered, ref }) => (
                                    <FixedSizeList
                                        height={200}
                                        itemCount={totalRecipesCount}
                                        itemSize={ITEM_SIZE}
                                        onScroll={handleListScroll} // FixedSizeList의 스크롤 이벤트 핸들러
                                        onItemsRendered={onItemsRendered}
                                        ref={ref}
                                        width={totalWidth}
                                        style={{overflow: 'visible'}}
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

export default RecipeTable;