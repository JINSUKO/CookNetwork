const express = require('express');
const router = express.Router();

const maria = require('../module/sql');

const isEmptyObject = obj => Object.keys(obj).length === 0;

// recipe 갯수
router.get('/recipeCounts', async (req, res) => {
    if (!isEmptyObject(req.query)) {console.log('/api/admin/recipeCounts req.query', req.query);}

    try {
        const sql = `SELECT count(*) as count FROM recipe`;

        const [ data ] = await maria.execute(sql);

        if ( data.length > 0) {
            res.status(200).json(data[0]);
        } else {
            throw new Error('No recipes found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e});
    }
})

// user 갯수
router.get('/userCounts', async (req, res) => {
    if (!isEmptyObject(req.query)) {console.log('/api/admin/userCounts req.query', req.query);}

    try {
        const sql = `SELECT count(*) as count FROM users`;

        const [ data ] = await maria.execute(sql);

        if ( data.length > 0) {
            res.status(200).json(data[0]);
        } else {
            throw new Error('No recipes found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e});
    }
})

// users
router.get('/recipes', async (req, res) => {

    const dropdownSearch = [
        "검색", "레시피 번호", "작성자", "유저 아이디", "레시피 이름", "레시피 설명", "레시피 재료"
    ];
    const dropdownSearchColumns = [
        "Recipe Id", "Author", "User Id", "Recipe Name", "Recipe Description", "Recipe Ingredients"
    ];

    const dropdownOrderColumns = [
        "Created Date", "User Id", "Recipe Id", "Recipe Name"
    ];

    const pageOptions = {};

    if (!isEmptyObject(req.query)) {
        console.log('/api/admin/recipes req.query', req.query);

        const tmp = {...req.query};

        Object.keys(tmp).forEach(key => {

            if (Number(tmp[key])) {
                pageOptions[key] = Number(tmp[key]);
                return;
            }

            pageOptions[key] = tmp[key];
        })

        pageOptions['recipePerPage'] = Number(tmp.recipePerPage);
        pageOptions['page'] = Number(tmp.page);
    }

    const keyList = Object.keys(pageOptions);
    let placeholderList = Object.values(pageOptions);
    const placeholderListCopy = [...placeholderList];

    console.log('keyList',keyList)
    console.log('placeholderList',placeholderList)

    const whereQueryList = [];
    let sortQuery= '';
    if (keyList.length - 2) {
        for (let i = 0; i < keyList.length - 2; i++) {

            let tmp = dropdownSearchColumns.filter((element, index) => (
                dropdownSearch[index + 1] === keyList[i]
            ))

            // for (let j = 0; j < dropdownSearchColumns.length; j++) {
            //     if (dropdownSearch[j + 1] === keyList[i]) {
            //         if (dropdownSearchColumns[j] === 'Recipe Id') {
            //             tmp.push('CAST(\`Recipe Id\` AS CHAR)');
            //         } else {
            //             tmp.push(dropdownSearchColumns[j]);
            //         }
            //     }
            // }


            if (tmp.length === 0) {
                if (keyList[i] === 'category') {
                    tmp.push('Recipe Categories');
                }
            }

            console.log('tmp',tmp)

            if (keyList[i] === 'ASC') {
                sortQuery = `ORDER BY \`${placeholderList[i]}\` ASC`;
                placeholderList = placeholderList.filter((element) => (!(element === placeholderListCopy[i])));
                break;
            } else if (keyList[i] === 'DESC') {
                sortQuery = `ORDER BY \`${placeholderList[i]}\` DESC`;
                placeholderList = placeholderList.filter((element) => (!(element === placeholderListCopy[i])));
                break;
            }


            if (tmp[0] === 'Recipe Id') {
                whereQueryList.push('CAST(\`Recipe Id\` AS CHAR) LIKE ?');
            } else {
                whereQueryList.push(`\`${tmp}\` LIKE ? `);
            }
            if (Array.isArray(placeholderList[i])) {
                whereQueryList.push(`\`${tmp}\` LIKE ? `);
            }

            if (tmp.length === 0) {

            }
        }
    }

    let whereQuery = whereQueryList.join(' AND ');

    if (whereQuery.length !== 0) {whereQuery = 'WHERE ' + whereQuery};

    console.log('whereQuery',whereQuery)
    console.log('sortQuery',sortQuery)



    //
    //
    // console.log(pageOptions)
    // console.log(placeholderList)
    //
    // // console.log(placeholderList.length - 2)
    //
    // // Object.entries(pageOptions).forEach(([key, value]) => {
    // //     console.log(`${key}: ${value}`);
    // // });
    // console.log(whereQuery);
    //
    // let sqltmp3 = null;
    //
    // if (whereQuery.length - 2) {
    //     sqltmp3 = whereQuery.map((list) => {
    //         console.log(list);
    //
    //         return list;
    //     }).join(' AND ')
    // }
    //
    // console.log(sqltmp3)

    // placeholderList[placeholderList.length - 1]

    placeholderList[placeholderList.length - 1] = (placeholderListCopy[placeholderListCopy.length - 2]) * (placeholderListCopy[placeholderListCopy.length - 1] -1);
    // placeholderListCopy[placeholderListCopy.length - 1] = (placeholderList[placeholderList.length - 2]) * (placeholderList[placeholderList.length - 1] -1);

    console.log('placeholderListCopy', placeholderListCopy)
    console.log('placeholderListCopy.flat()', placeholderListCopy.flat())

    // const [ data121 ] = (sql, [pageOptions.recipePerPage, pageOptions.recipePerPage * (pageOptions.page - 1)]);
    let sqltmp = `SELECT *
                        FROM ( SELECT 
                        r.recipe_id AS 'Recipe Id',
                        u.username AS 'Author',
                        u.user_id AS 'User Id',
                        r.recipe_name AS 'Recipe Name',
                        r.recipe_img AS 'Recipe Image',
                        r.recipe_desc AS 'Recipe Description',
                        GROUP_CONCAT(DISTINCT c.category_name ORDER BY c.category_id SEPARATOR ', ') AS 'Recipe Categories',
                        GROUP_CONCAT(DISTINCT CONCAT(i.ingredient_name, ' (', ri.count, ' ', ri.ingredient_unit, ')') ORDER BY ri.ingredient_id SEPARATOR ', ') AS 'Recipe Ingredients',
                        GROUP_CONCAT(DISTINCT CONCAT(ro.cooked_order, '. ', ro.order_desc) ORDER BY ro.cooked_order SEPARATOR '\n') AS 'Cooked Orders',
                        r.cooked_time AS 'Cooked Time',
                        r.serving AS 'Serving',
                        r.level AS 'Level',
                        r.tips AS 'Tips',
                        r.create_post_date AS 'Created Date',
                        r.lastupdate_post_date AS 'Last Updated Date',
                        r.post_type AS 'Post Type',
                        r.bookmark_count AS 'Bookmark Counts'
                    FROM 
                        recipe r
                    JOIN 
                        recipe_category rc ON r.recipe_id = rc.recipe_id
                    JOIN 
                        categories c ON rc.category_id = c.category_id
                    JOIN 
                        recipe_ingredient ri ON r.recipe_id = ri.recipe_id
                    JOIN
                        ingredient i ON ri.ingredient_id = i.ingredient_id
                    JOIN
                        recipe_orders ro ON r.recipe_id = ro.recipe_id
                    JOIN 
                        users u ON r.user_code = u.user_code
                    GROUP BY 
                        r.recipe_id ) t `;
    sqltmp = sqltmp + whereQuery + sortQuery + ` LIMIT ? OFFSET ?;`;

    console.log('sqltmp\n',sqltmp);
    try {
        // const sql = `SELECT
        //                 r.recipe_id AS 'Recipe Id',
        //                 u.username AS 'Author',
        //                 u.user_id AS 'User Id',
        //                 r.recipe_name AS 'Recipe Name',
        //                 r.recipe_img AS 'Recipe Image',
        //                 r.recipe_desc AS 'Recipe Description',
        //                 GROUP_CONCAT(DISTINCT c.category_name ORDER BY c.category_id SEPARATOR ', ') AS 'Recipe Categories',
        //                 GROUP_CONCAT(DISTINCT CONCAT(i.ingredient_name, ' (', ri.count, ' ', ri.ingredient_unit, ')') ORDER BY ri.ingredient_id SEPARATOR ', ') AS 'Recipe Ingredients',
        //                 GROUP_CONCAT(DISTINCT CONCAT(ro.cooked_order, '. ', ro.order_desc) ORDER BY ro.cooked_order SEPARATOR '\n') AS 'Cooked Orders',
        //                 r.cooked_time AS 'Cooked Time',
        //                 r.serving AS 'Serving',
        //                 r.level AS 'Level',
        //                 r.tips AS 'Tips',
        //                 r.create_post_date AS 'Created Date',
        //                 r.lastupdate_post_date AS 'Last Updated Date',
        //                 r.post_type AS 'Post Type',
        //                 r.bookmark_count AS 'Bookmark Counts'
        //             FROM
        //                 recipe r
        //             JOIN
        //                 recipe_category rc ON r.recipe_id = rc.recipe_id
        //             JOIN
        //                 categories c ON rc.category_id = c.category_id
        //             JOIN
        //                 recipe_ingredient ri ON r.recipe_id = ri.recipe_id
        //             JOIN
        //                 ingredient i ON ri.ingredient_id = i.ingredient_id
        //             JOIN
        //                 recipe_orders ro ON r.recipe_id = ro.recipe_id
        //             JOIN
        //                 users u ON r.user_code = u.user_code
        //             GROUP BY
        //                 r.recipe_id
        //             LIMIT ? OFFSET ?;`;
        let sql = `SELECT *
                            FROM ( SELECT 
                            r.recipe_id AS 'Recipe Id',
                            u.username AS 'Author',
                            u.user_id AS 'User Id',
                            r.recipe_name AS 'Recipe Name',
                            r.recipe_img AS 'Recipe Image',
                            r.recipe_desc AS 'Recipe Description',
                            GROUP_CONCAT(DISTINCT c.category_name ORDER BY c.category_id SEPARATOR ', ') AS 'Recipe Categories',
                            GROUP_CONCAT(DISTINCT CONCAT(i.ingredient_name, ' (', ri.count, ' ', ri.ingredient_unit, ')') ORDER BY ri.ingredient_id SEPARATOR ', ') AS 'Recipe Ingredients',
                            GROUP_CONCAT(DISTINCT CONCAT(ro.cooked_order, '. ', ro.order_desc) ORDER BY ro.cooked_order SEPARATOR '\n') AS 'Cooked Orders',
                            r.cooked_time AS 'Cooked Time',
                            r.serving AS 'Serving',
                            r.level AS 'Level',
                            r.tips AS 'Tips',
                            r.create_post_date AS 'Created Date',
                            r.lastupdate_post_date AS 'Last Updated Date',
                            r.post_type AS 'Post Type',
                            r.bookmark_count AS 'Bookmark Counts'
                        FROM 
                            recipe r
                        JOIN 
                            recipe_category rc ON r.recipe_id = rc.recipe_id
                        JOIN 
                            categories c ON rc.category_id = c.category_id
                        JOIN 
                            recipe_ingredient ri ON r.recipe_id = ri.recipe_id
                        JOIN
                            ingredient i ON ri.ingredient_id = i.ingredient_id
                        JOIN
                            recipe_orders ro ON r.recipe_id = ro.recipe_id
                        JOIN 
                            users u ON r.user_code = u.user_code
                        GROUP BY 
                            r.recipe_id ) t \n`;
        sql = sql + whereQuery + sortQuery + ` LIMIT ? OFFSET ?;`;
    console.log(placeholderList.flat())
        const [ data ] = await maria.execute(sql, placeholderList.flat());
        // const [ data ] = await maria.execute(sql, [pageOptions.recipePerPage, pageOptions.recipePerPage * (pageOptions.page - 1)]);

        if ( data.length > 0) {
            res.status(200).json(data);
        } else {
            // throw new Error('recipe');
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e});
    }
})


module.exports = router;