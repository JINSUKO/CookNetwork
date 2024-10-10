const express = require('express');
const multer = require('multer');
// const iconv = require('iconv-lite');
const router = express.Router()

// const cloudinary = require('./cloudinaryConfig');
const maria = require('../module/sql') ;
const { uploadCloudinary } = require('../module/uploadImg');

const storage = multer.memoryStorage(); // 메모리에 저장
const upload = multer({ storage });

router.get('/', async(req,res)=>{
    const ingredientQuery = `
    SELECT ingredient_name
    FROM ingredient
    `
    const [ingredients] = await maria.execute(ingredientQuery);

    return res.json(ingredients);
})


router.post('/',upload.fields([{ name: 'recipe_img',maxCount: 1},{ name: 'step_img'}]),async(req,res)=>{
    const recipeData = JSON.parse(req.body.recipeData);
    const stepImg = req.files['step_img'];
    const recipeImg = req.files['recipe_img'][0];
    const recipeFilter = recipeData.filters
    console.log(recipeData)
    console.log('files: ', stepImg)

    let filters = ''
    const ingredients = [...recipeData.ingredients]
    const cooked_orders = [...recipeData.cooked_order]
    if(recipeFilter.length === 1||recipeFilter.length === 0) { filters = recipeFilter}
    else{filters = recipeFilter}

    console.log(filters)


    // recipe_img 파일명 한글 인코딩
    // const recipe_img = {
    //     ...req.files['recipe_img'][0],
    //     originalname: iconv.decode(Buffer.from(req.files['recipe_img'][0].originalname, 'latin1'), 'utf8')
    // };

    // cloudinary 내의 저장경로 지정
    const recipeImgFolder = `thumbnail/`

    // cloudinary에 저장하는 하고 public_id를 불러와 uploadRecipeImg에 저장
    const uploadRecipeImg = await uploadCloudinary(recipeImg.buffer,recipeImgFolder)

    console.log(uploadRecipeImg)

    //public_id를에서 displayName만 가져옴
    const displayName = uploadRecipeImg.split('/').pop();
    console.log(displayName)

    const stepImgIds = [];
    // displayName/ 경로에 비동기로 저장하되 순서대로 저장하고 public_id를 반환
    if(stepImg){
        const uploadStepImg = stepImg.map((file,index) =>{
            const stepImgFolder = `stepimg/${displayName}/`
            const result = uploadCloudinary(file.buffer,stepImgFolder,index+1)
            return result
        })

        stepImgIds.push(...await Promise.all(uploadStepImg))
    }



    console.log(stepImgIds)

    //     const uploadStepImg = stepImg.map((file,index)=>{
    //         return new Promise((resolve,reject)=>{
    //             const stream = cloudinary.uploader.upload_stream(
    //                 {
    //                     resource_type: 'image',
    //                     format: 'webp',
    //                     folder: `recipes/stepimg/${uploadRecipeImg.display_name}`,
    //                     public_id: `${index+1}`
    //                 },(error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result.public_id);
    //                 }
    //             );

    //             stream.end(file.buffer); 
    //         })
    //     })

    //     stepImgIds.push(...await Promise.all(uploadStepImg));
    // }
    
    // 새로운 레시피 등록하는 쿼리 유저코드는 user_id를 users에서 찾아 insert
    const insertRecipe = `
    INSERT INTO recipe(user_code,recipe_name,recipe_img,recipe_desc,cooked_time,serving,level,tips)
    SELECT user_code, ?,?,?,?,?,?,?
    FROM users
    WHERE user_id = ?
    `
    const insertIngredient = `
    INSERT INTO recipe_ingredient(recipe_id, ingredient_id,count,ingredient_unit)
    SELECT ?,ingredient_id,?,?
    FROM ingredient
    WHERE ingredient_name = ?
    `

    const insertCategory = `
    INSERT INTO recipe_category(recipe_id,category_id)
    SELECT ?, category_id
    FROM categories
    WHERE category_name = ?
    `
    const insertOrder=`
    INSERT INTO recipe_orders(recipe_id,cooked_order,order_desc,order_img)
    VALUES (?,?,?,?)    
    `

    const connection = await maria.getConnection();
     
    try{
        await connection.beginTransaction()

            const [recipe] = await connection.execute(insertRecipe,[recipeData.recipe_name,
                                                                    uploadRecipeImg,
                                                                    recipeData.recipe_desc||'',
                                                                    recipeData.cooked_time,
                                                                    recipeData.serving,
                                                                    recipeData.level,
                                                                    recipeData.tips||'',
                                                                    recipeData.user_id]);
            const recipeId = recipe.insertId;

            console.log(recipeId)
            
            const promiseArray = []
            
            if(!(ingredients === '' ||ingredients ===' ')){
                const ingredientPromise = ingredients.map((ingredient,index)=>{
                    return connection.execute(insertIngredient,[recipeId,
                                                                ingredient.count||0,
                                                                ingredient.unit||'',
                                                                ingredient.name]);
                })
                promiseArray.push(ingredientPromise);
            }
            

            const categoryPromise = connection.execute(insertCategory,[recipeId,recipeData.category]);
            promiseArray.push(categoryPromise);

            if(!(filters ===''|| filters === ' ')){
                const filterPromise = filters.map((filter) =>{
                    return connection.execute(insertCategory,[recipeId,filter])
                })
                promiseArray.push(filterPromise)
            }
            
            if(!(stepImgIds.length === 0 && cooked_orders[0].order_desc==='')){
                const orderPromise = cooked_orders.map((step,index)=>{
                    return connection.execute(insertOrder,[recipeId,
                                                            step.cooked_order,
                                                            step.order_desc||'',
                                                            stepImgIds[index]||''])
                })
                promiseArray.push(orderPromise)
            }
            await Promise.all(...promiseArray)
            
        await connection.commit();
        return res.status(200).json({message: '레시피 작성 완료!'});
    }catch(err){
        await connection.rollback();
        console.log('레시피 작성중 에러 발생:', err)
        return res.status(403).json({message: '레시피 작성중 문제가 발생했습니다'});
    }finally{
        connection.release();
    }



    // const [result] = await maria.execute(insertRecipe,[recipe_name,recipe_img,recipe_desc,cooked_time,serving,level,tips])
    // const connection = await maria.getConnection();
    // try{
    //     await connection.beginTransaction()

    //     await connection.commit();
    // } catch(error){
    //     await connection.rollback();
    //     console.log(error)
    // } finally{
    //     connection.release()
    // }
    return res.json({response: 'ok1'})
})

module.exports = router;