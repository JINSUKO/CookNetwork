const API_URL = import.meta.env.VITE_HOST_IP;

export const getRecipesCount = async ({search={}, filter=[], sort={}} = {}) => {
    let url = `${API_URL}/api/admin/recipeCounts`;

    const queries = [];

    if (Object.keys(search).length > 0) {
        queries.push(`${Object.keys(search)[0]}=${search[Object.keys(search)[0]]}`);
    }

    if(filter.length > 0){
        queries.push(filter.map((query) => (`category=${query}`)).join('&'));
    }

    if(Object.keys(sort).length > 0) {
        queries.push(`${Object.keys(sort)[0]}=${sort[Object.keys(sort)[0]]}`);
    }

    if(queries.length > 0){
        url = url + '?' + queries.join('&');
    }

    console.log('/api/admin/recipeCounts', url);

    try {
        const response = await fetch(url)

        const data = await response.json();
        console.log('Admin All recipes Counts:', data);

        return data.count;

    } catch (e) {
        console.error(e);
    }

}

export const getUsersCount = async ({search={}, filter=[], sort={}} = {}) => {
    let url = `${API_URL}/api/admin/userCounts`;

    const queries = [];

    if (Object.keys(search).length > 0) {
        queries.push(`${Object.keys(search)[0]}=${search[Object.keys(search)[0]]}`);
    }

    if(filter.length > 0){
        queries.push(filter.map((query) => (`category=${query}`)).join('&'));
    }

    if(Object.keys(sort).length > 0){
        queries.push(`${Object.keys(sort)[0]}=${sort[Object.keys(sort)[0]]}`);
    }

    if(queries.length > 0){
        url = url + '?' + queries.join('&');
    }

    console.log('/api/admin/userCounts', url);

    try {
        const response = await fetch(url)

        const data = await response.json();
        console.log('Admin All user Counts:', data);

        return data.count;

    } catch (e) {
        console.error(e);
    }
}

export const getRecipes = async ({search={}, filter=[], sort={}, recipePerPage=1, page=1} = {}) => {
    let url = `${API_URL}/api/admin/recipes`;

    const queries = [];

    if (Object.keys(search).length > 0) {
        queries.push(`${Object.keys(search)[0]}=${search[Object.keys(search)[0]]}`);
    }

    if (filter.length > 0) {
        queries.push(filter.map((query) => (`category=${query}`)).join('&'));
    }

    if (Object.keys(sort).length > 0) {
        queries.push(`${Object.keys(sort)[0]}=${sort[Object.keys(sort)[0]]}`);
    }

    queries.push(`recipePerPage=${recipePerPage}`);
    queries.push(`page=${page}`);

    url = url + '?' + queries.join('&');

    console.log('/api/admin/recipes', url);

    try {
        const response = await fetch(url)

        const data = await response.json();

        console.log('Admin All recipe Counts:', data);

        return data;

    } catch (e) {
        console.error(e);
    }
}

