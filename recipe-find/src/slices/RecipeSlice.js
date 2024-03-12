import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import RecipeService from "../services/RecipeService";
import { setMessage } from "./Message";

// Acțiune asincronă pentru adăugarea unei rețete
export const addRecipe = createAsyncThunk(
  "recipe/create",
  async (recipeData, thunkAPI) => {
    try {
      const response = await RecipeService.addRecipe(recipeData);
      thunkAPI.dispatch(setMessage(response.data.message)); // Setează un mesaj pentru afișare (opțional)
      return response.data; // Returnează datele primite de la server (opțional)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message)); // Setează un mesaj de eroare pentru afișare (opțional)
      return thunkAPI.rejectWithValue(); // Folosește această metodă pentru a trata eroarea și a o trimite mai departe (opțional)
    }
  }
);

// Starea inițială a slice-ului pentru rețete
const initialState = {
  recipes: [], // Lista de rețete
  loading: false, // Indicator pentru încărcarea datelor
  error: null // Mesaj de eroare în caz de eșec la încărcare
};

// Crearea slice-ului pentru rețete
const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    // Alte reduceri pot fi adăugate aici pentru gestionarea altor acțiuni legate de rețete
  },
  extraReducers: {
    [addRecipe.pending]: (state) => {
      state.loading = true; // Setează indicatorul de încărcare când se inițiază adăugarea unei rețete
      state.error = null; // Resetarea mesajului de eroare înainte de a începe cererea
    },
    [addRecipe.fulfilled]: (state) => {
      state.loading = false; // Dezactivează indicatorul de încărcare când adăugarea rețetei a fost finalizată cu succes
    },
    [addRecipe.rejected]: (state, action) => {
      state.loading = false; // Dezactivează indicatorul de încărcare în caz de eșec la adăugarea rețetei
      state.error = action.payload; // Setează mesajul de eroare în funcție de rezultatul eșuat al adăugării rețetei (opțional)
    }
  }
});

// Exportarea reducer-ului și acțiunilor slice-ului pentru rețete
export const { reducer } = recipeSlice;
export default reducer;