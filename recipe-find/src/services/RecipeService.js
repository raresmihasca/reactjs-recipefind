import axios from "axios";

const baseURL = "http://localhost:8080/api";

const addRecipe = async (formData) => {
  try {
    const response = await axios.post(`${baseURL}/recipes/create`, formData, {
      
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const RecipeService = {
  addRecipe,
};

export default RecipeService;