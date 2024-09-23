const express = require('express');
const router = express.Router();

const maria = require('../module/sql');
const {query} = require("express");

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

    const pageOptions = {};
    const placeholderList = [];

    if (!isEmptyObject(req.query)) {
        console.log('/api/admin/recipes req.query', req.query);

        const tmp = {...req.query};

        Object.keys(tmp).forEach(key => {

            if (Number(tmp[key])) {
                pageOptions[key] = Number(tmp[key]);
                placeholderList.push(Number(tmp[key]));
                return;
            }

            pageOptions[key] = tmp[key];
            placeholderList.push(tmp[key]);
        })

        pageOptions['recipePerPage'] = Number(tmp.recipePerPage);
        pageOptions['page'] = Number(tmp.page);
    }

    console.log(pageOptions)
    console.log(placeholderList)

    console.log(placeholderList.length - 2)

    if (placeholderList.length - 2) {}

    placeholderList[placeholderList.length - 1]

    const placeholderList2 = [...placeholderList];

    placeholderList2[placeholderList2.length - 1] = placeholderList.length - 1;

    const sqltmp = `SELECT 
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
                        r.recipe_id
                    LIMIT ? OFFSET ?;`;

    // const [ data121 ] = (sql, [pageOptions.recipePerPage, pageOptions.recipePerPage * (pageOptions.page - 1)]);

    try {
        const sql = `SELECT 
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
                        r.recipe_id
                    LIMIT ? OFFSET ?;`;


        const [ data ] = await maria.execute(sql, [pageOptions.recipePerPage, pageOptions.recipePerPage * (pageOptions.page - 1)]);

        if ( data.length > 0) {
            res.status(200).json(data);
        } else {
            throw new Error('No users found');
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e});
    }
})


module.exports = router;