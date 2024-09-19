const API_URL = import.meta.env.VITE_HOST_IP;

export const getRecipesCount = async ({filter=[], sort=''} = {}) => {
    let url = `${API_URL}/api/admin/recipeCounts`;

    const queries = [];

    if(filter.length > 0){
        queries.push(filter.map((query) => (`category=${query}`)).join('&'));
    }

    if(sort.length > 0){
        queries.push(`sort=${sort}`);
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

export const getUsersCount = async ({filter=[], sort=''} = {}) => {
    let url = `${API_URL}/api/admin/userCounts`;

    const queries = [];

    if(filter.length > 0){
        queries.push(filter.map((query) => (`category=${query}`)).join('&'));
    }

    if(sort.length > 0){
        queries.push(`sort=${sort}`);
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

export const getRecipes = async ({filter=[], sort='', recipePerPage=1, page=1} = {}) => {
    let url = `${API_URL}/api/admin/recipes`;

    const queries = [];

    if(filter.length > 0){
        queries.push(filter.map((query) => (`category=${query}`)).join('&'));
    }

    if(sort.length > 0){
        queries.push(`sort=${sort}`);
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

