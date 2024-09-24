const cloudinary = require('./cloudinaryConfig');

const mappingImg = (recipes) =>{
    // const results = await cloudinary.api.resources_by_ids(ids);
    // const imgUrl = results.resources.map(resource => ({
    //     public_id: resource.public_id,
    //     secure_url: resource.secure_url,
    // }));

    // cloudinary에 연동하여 id에 해당하는 이미지를 찾아서 해당하는 링크를 검색 후 전송하는 코드를 작성했으나..
    // cloudinary.com/클라우드이름/사진이름/링크로 직접 보내는게 훨씬 빨라서 변경( 500ms -> 10ms로 단축)

    const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload`

    const imgMap = {}
    recipes.forEach((recipe)=>{
        const public_id = recipe.recipe_img
        imgMap[public_id] = `${url}/${public_id}`
    })

    return recipes.map(recipe => { 
        const imgUrl = imgMap[recipe.recipe_img] || null;
        return {...recipe, recipe_img: imgUrl}
    })
}


module.exports = mappingImg;