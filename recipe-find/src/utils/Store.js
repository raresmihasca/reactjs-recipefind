import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/Auth';
import messageReducer from '../slices/Message';
import recipeReducer from '../slices/RecipeSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        message: messageReducer,
        recipe: recipeReducer
    },
})

export default store;