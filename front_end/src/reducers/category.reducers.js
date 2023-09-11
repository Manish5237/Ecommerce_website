import { categoryConstants } from '../actions/constants'

const initState = {
    categories: [],
    loading: false,
    error: null
};

const buildNewCategories = (parentId, categories, category) => {
    let myCategories = [];

    if (parentId === undefined) {
        return [
            ...categories,
            {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                childern: []
            }
        ];
    }
    for (let cat of categories) {

        if (cat._id === parentId) {
            myCategories.push({
                ...cat,
                childern: cat.childern ? buildNewCategories(parentId, [...cat.childern,
                {
                    _id: category._id,
                    name: category.name,
                    slug: category.slug,
                    parentId: category.parentId,
                    childern: category.childern
                }], category) : []
            })
        } else {
            myCategories.push({
                ...cat,
                childern: cat.childern ? buildNewCategories(parentId, cat.childern, category) : []
            })
        }
    }
    return myCategories;
}

export default (state = initState, action) => {
    switch (action.type) {
        case categoryConstants.GET_ALL_CATEGORIES_SUCCESS:
            state = {
                ...state,
                categories: action.payload.categories
            }
            break;
        case categoryConstants.ADD_NEW_CATEGORY_REQUEST:
            state = {
                ...state,
                loading: true
            }
            break;
        case categoryConstants.ADD_NEW_CATEGORY_SUCCESS:
            const updatedCategories = buildNewCategories(action.payload.category.parentId, state.categories, action.payload.category)
            // console.log(updatedCategories);
            state = {
                ...state,
                categories: updatedCategories,
                loading: false
            }
            break;
        case categoryConstants.ADD_NEW_CATEGORY_FAILURE:
            state = {
                ...initState
            }
            break;
    }

    return state;
}