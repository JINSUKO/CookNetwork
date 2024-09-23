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

    const currentPage = useRef(1);
    const tableRef = useRef(null);
    const ITEMS_PER_PAGE = 2;
    const ITEM_SIZE = 70;

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
    }, [filter, sort, isRecipesLoading, recipes.length])

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

    const RecipeRow = React.memo(({ index, style }) => {
        console.log('index', index)
        const recipe = recipes[index];
        if (!recipe) {
            return <div style={style}>
                <div>more...</div>
            </div>;
            // return ;
        }

        return (
            <div style={{...style, width: `${totalWidth}px`}} className={AdminStyle.tableRow}>
                <div style={{width: `${columns[0].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Recipe Id']}</div>
                <div style={{width: `${columns[1].width}px`}} className={AdminStyle.tableCell}>{recipe['Author']}</div>
                <div style={{width: `${columns[2].width}px`}} className={AdminStyle.tableCell}>{recipe['User Id']}</div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeName}`}>
                    <span className={AdminStyle.truncated}>{recipe['Recipe Name']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Recipe Name']}</span>
                </div>
                <div style={{width: `${columns[4].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Recipe Image']}</div>
                <div className={`${AdminStyle.tooltipContainer} ${AdminStyle.recipeDescription}`}>
                    <span className={AdminStyle.truncated}>{recipe['Recipe Description']}</span>
                    <span className={AdminStyle.tooltipText}>{recipe['Recipe Description']}</span>
                </div>
                <div style={{width: `${columns[6].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Recipe Categories']}</div>
                <div style={{width: `${columns[7].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Cooked Time']}</div>
                <div style={{width: `${columns[8].width}px`}} className={AdminStyle.tableCell}>{recipe['Serving']}</div>
                <div style={{width: `${columns[9].width}px`}} className={AdminStyle.tableCell}>{recipe['Level']}</div>
                <div style={{width: `${columns[10].width}px`}} className={AdminStyle.tableCell}>{recipe['Tips']}</div>
                <div style={{width: `${columns[11].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Created Date']}</div>
                <div style={{width: `${columns[12].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Last Updated Date']}</div>
                <div style={{width: `${columns[13].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Post Type']}</div>
                <div style={{width: `${columns[14].width}px`}}
                     className={AdminStyle.tableCell}>{recipe['Bookmark Counts']}</div>
            </div>
        );
    });

    return (
            <Card>
                <Card.Header as="h5">Recent Recipes</Card.Header>
                <Card.Body>
                    <div className={AdminStyle.tableContainer} ref={tableRef}>
                        <Container fluid>
                            <div className={AdminStyle.tableHeader}>
                                {columns.map(column => (
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
                                            height={400}
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

export default RecipeTable;