import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadUserRecipes,
  removeRecipe,
  removeUserRecipe,
  setFilterBy,
} from "../store/actions/recipe.actions";
import { Link } from "react-router-dom";
import { recipeService } from "../services/recipe.service.local";

export function UserRecipes({ userId }) {
  // console.log("userId: ", userId);
  const recipes = useSelector(
    (storeState) => storeState.recipeModule.userRecipes
  );
  const dispatch = useDispatch();

  const filterBy = recipeService.getEmptyFilterBy()

  useEffect(() => {
    dispatch(setFilterBy({ ...filterBy, userId }));
    dispatch(loadUserRecipes());
  }, []);

  const onRemoveRecipe = useCallback(async (recipeId) => {
    try {
      dispatch(removeRecipe(recipeId));
      dispatch(removeUserRecipe(recipeId));
    } catch (error) {
      console.log("error:", error);
    }
  }, []);

  if (!recipes) return <div>Loading...</div>;
  if (recipes.length === 0) return <div>there are no recipes...</div>;
  return (
    <section className="user-recipes">
      <section className="user-recipe-list">
        {recipes.map((recipe) => (
          <article key={recipe._id} className="user-recipe-preview">
            <Link to={`/recipe/${recipe._id}`} className="info">
              <img src={recipe.imgUrl} alt="" />
              <h3 className="title">{recipe.title}</h3>
              <h4 className="description">{recipe.description}</h4>
            </Link>
            <button
              className="btn-remove"
              onClick={() => onRemoveRecipe(recipe._id)}
            >
              X
            </button>
            <Link className="edit" to={`/recipe/edit/${recipe._id}`}>
              <button className="btn-edit">Edit</button>
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}