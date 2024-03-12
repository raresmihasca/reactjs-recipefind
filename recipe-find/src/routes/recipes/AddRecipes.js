import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { addRecipe } from '../../slices/RecipeSlice'; // Importă acțiunea pentru adăugarea rețetei
import { clearMessage } from "../../slices/Message";
import './AddRecipes.css';
import TimedPopup from '../../components/popup/TimedPopup';
import RecipeService from '../../services/RecipeService';

const AddRecipes = () => {
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupMessageType, setPopupMessageType] = useState('');

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    imageFile: null,
    recipe: {
      name: '',
      prepTime: '',
      servings: '',
      cookTime: '',
      instructions: '',
      category: [],
      ingredients: [
        {
          ingredient: {
            name: '',
            proteins: '',
            fats: '',
            carbohydrates: '',
            kcal: ''
          },
          quantity: '',
          unitOfMeasure: ''
        }
      ]
    }
  };

  const validationSchema = Yup.object().shape({
    imageFile: Yup.mixed().required('This field is required!'),
    recipe: Yup.object().shape({
      name: Yup.string().required('This field is required!'),
      prepTime: Yup.number().required('This field is required!'),
      servings: Yup.number().required('This field is required!'),
      cookTime: Yup.number().required('This field is required!'),
      instructions: Yup.string().required('This field is required!'),
      category: Yup.array().required('At least one category must be selected!'),
      ingredients: Yup.array().of(Yup.object().shape({
        ingredient: Yup.object().shape({
          name: Yup.string().required('Ingredient name is required!'),
          proteins: Yup.number().required('Proteins is required!'),
          fats: Yup.number().required('Fats is required!'),
          carbohydrates: Yup.number().required('Carbohydrates is required!'),
          kcal: Yup.number().required('Kcal is required!'),
        }),
        quantity: Yup.number().required('Quantity is required!'),
        unitOfMeasure: Yup.string().required('Unit of measure is required!'),
      })).required('At least one ingredient must be added!'),
    }),
  });

 
  const handleSubmit = (formValue) => {
    const { imageFile, recipe } = formValue;

    // Modificăm structura rețetei pentru a se potrivi așteptărilor backend-ului
    const modifiedRecipe = {
        recipe: {
            name: recipe.name,
            prepTime: recipe.prepTime,
            servings: recipe.servings,
            cookTime: recipe.cookTime,
            instructions: recipe.instructions,
            category: recipe.category
        },
        ingredients: recipe.ingredients.map(ingredient => ({
            ingredient: {
                name: ingredient.name,
                proteins: ingredient.proteins,
                fats: ingredient.fats,
                carbohydrates: ingredient.carbohydrates,
                kcal: ingredient.kcal
            },
            quantity: ingredient.quantity,
            unitOfMeasure: ingredient.unitOfMeasure
        }))
    };

    // Convertim obiectul modificat în JSON string
    const modifiedRecipeJSON = JSON.stringify(modifiedRecipe);

    // Convertim JSON string în blob
    const recipeBlob = new Blob([modifiedRecipeJSON], { type: 'application/json' });

    // Creăm un obiect FormData
    const formData = new FormData();
    
    // Adăugăm fișierul imagine și blob-ul rețetei la FormData
    formData.append('image', imageFile);
    formData.append('recipeRequest', recipeBlob);

    // Trimitem FormData la server
    RecipeService.addRecipe(formData)
      .then(() => {
        setPopupMessage('Recipe added successfully!');
        setPopupMessageType('success');
        setIsPopupVisible(true);
      })
      .catch((error) => {
        setPopupMessage(error.response.data.message || 'Failed to add recipe. Please try again later.');
        setPopupMessageType('error');
        setIsPopupVisible(true);
      });
  };




  const handleAddIngredient = (values, setFieldValue) => {
    const newIngredient = {
      ingredient: {
        name: '',
        proteins: '',
        fats: '',
        carbohydrates: '',
        kcal: ''
      },
      quantity: '',
      unitOfMeasure: ''
    };

    const updatedIngredients = [...values.recipe.ingredients, newIngredient];
    setFieldValue('recipe.ingredients', updatedIngredients);
  };

  return (
    <>
    {isPopupVisible && (<TimedPopup message={popupMessage} isVisible={isPopupVisible} setIsVisible={setIsPopupVisible}
                                    messageType={popupMessageType} timer={2000} redirect={`/`}></TimedPopup>)}

    <div className="add-recipe-form">
      <h2>Add Recipe</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, handleChange, setFieldValue, setValues }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="imageFile">Image:</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={(event) => {
                  setFieldValue('imageFile', event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="imageFile" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="recipe.name">Name:</label>
              <Field type="text" name="recipe.name" />
              <ErrorMessage name="recipe.name" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="recipe.prepTime">prepTime:</label>
              <Field type="number" name="recipe.prepTime" />
              <ErrorMessage name="recipe.prepTime" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="recipe.servings">servings:</label>
              <Field type="number" name="recipe.servings" />
              <ErrorMessage name="recipe.servings" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="recipe.cookTime">cookTime:</label>
              <Field type="number" name="recipe.cookTime" />
              <ErrorMessage name="recipe.cookTime" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="recipe.instructions">instructions:</label>
              <Field type="text" name="recipe.instructions" />
              <ErrorMessage name="recipe.instructions" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="recipe.category">Category:</label>
              <select
                id="category"
                name="recipe.category"
                multiple={true}
                value={values.recipe.category}
                onChange={handleChange}
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="DESSERT">Dessert</option>
                <option value="SNACK">Snack</option>
                <option value="OTHER">Other</option>
                {/* Alte opțiuni de categorie */}
              </select>
              <ErrorMessage name="recipe.category" component="div" className="error-message" />
            </div>
            {/* Alte câmpuri pentru detaliile rețetei... */}

            <div className="form-group">
              <label>Ingredients:</label>
              {values.recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient">
                <input
                  type="text"
                  name={`recipe.ingredients[${index}].ingredient.name`}
                  value={ingredient.ingredient.name}
                  onChange={handleChange}
                  placeholder="Ingredient name"
                />
                <input
                  type="number"
                  name={`recipe.ingredients[${index}].ingredient.proteins`}
                  value={ingredient.ingredient.proteins}
                  onChange={handleChange}
                  placeholder="Proteins"
                />
                <input
                  type="number"
                  name={`recipe.ingredients[${index}].ingredient.fats`}
                  value={ingredient.ingredient.fats}
                  onChange={handleChange}
                  placeholder="Fats"
                />
                <input
                  type="number"
                  name={`recipe.ingredients[${index}].ingredient.carbohydrates`}
                  value={ingredient.ingredient.carbohydrates}
                  onChange={handleChange}
                  placeholder="Carbohydrates"
                />
                <input
                  type="number"
                  name={`recipe.ingredients[${index}].ingredient.kcal`}
                  value={ingredient.ingredient.kcal}
                  onChange={handleChange}
                  placeholder="Kcal"
                />
                <input
                  type="number"
                  name={`recipe.ingredients[${index}].quantity`}
                  value={ingredient.quantity}
                  onChange={handleChange}
                  placeholder="Ingredient quantity"
                />
                <input
                  type="text"
                  name={`recipe.ingredients[${index}].unitOfMeasure`}
                  value={ingredient.unitOfMeasure}
                  onChange={handleChange}
                  placeholder="Ingredient unitOfMeasure"
                />
              </div>
              ))}
              {/* <button type="button" onClick={() => handleAddIngredient(values, setValues)}>
                Add Ingredient
              </button> */}

              <button type="button" onClick={() => handleAddIngredient(values, setFieldValue)}>
                Add Ingredient
              </button>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
      
    </div>
    </>
  );
};

export default AddRecipes;
