import { useEffect, useState } from 'react';
import './App.css';
const API_KEY = import.meta.env.VITE_APP_API_KEY;
console.log('API Key:', API_KEY);

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true&addRecipeNutrition=true&instructionsRequired=true`
        );
        const data = await response.json();
        setRecipes(data.results);
      } catch (err) {
        setError('Failed to fetch Recipes'); 
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, []);
  
  const filteredRecipes = recipes.filter(recipe => {
    if (!recipe || !recipe.title) return false;
    
    // Basic search by title
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Updated cuisine filter logic
    const matchesCuisine = cuisineFilter === 'all' || 
      (recipe.cuisines && Array.isArray(recipe.cuisines) && recipe.cuisines.map(cuisine => 
        cuisine.toLowerCase()).includes(cuisineFilter.toLowerCase()));
    
    // Diet filter logic
    const matchesDiet = dietFilter === 'all' || 
      (recipe.diets && Array.isArray(recipe.diets) && recipe.diets.map(diet => 
        diet.toLowerCase()).includes(dietFilter.toLowerCase()));
    
    return matchesSearch && matchesCuisine && matchesDiet;
  });
  
  const stats = {
    totalRecipes: filteredRecipes.length,
    averageCalories: filteredRecipes.length > 0 ? 
      filteredRecipes.reduce((acc, recipe) => 
        acc + (recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0), 0
      ) / filteredRecipes.length : 0,
    healthyRecipes: filteredRecipes.filter(recipe => 
      recipe.healthScore >= 70
    ).length,
  };

  return (
    <div className="p-8">
      {/* Statistics Section */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-2xl font-bold">{stats.totalRecipes}</div>
          <div className="text-gray-600">Total Recipes</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-2xl font-bold">{stats.averageCalories.toFixed(0)}</div>
          <div className="text-gray-600">Avg. Calories</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-2xl font-bold">{stats.healthyRecipes}</div>
          <div className="text-gray-600">Healthy Recipes</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          className="p-2 border rounded"
        >
           <option value="all">All Cuisines</option>
          <option value="american">American</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
          <option value="chinese">Chinese</option>
          <option value="indian">Indian</option>
          <option value="japanese">Japanese</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="greek">Greek</option>
          <option value="french">French</option>
          <option value="thai">Thai</option>
          <option value="vietnamese">Vietnamese</option>
          <option value="korean">Korean</option>
        </select>
        <select
          value={dietFilter}
          onChange={(e) => setDietFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
        </select>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-center p-4">{error}</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white p-4 rounded shadow">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="font-bold mb-2">{recipe.title}</h3>
              <div className="text-sm text-gray-600">
                <div>Calories: {recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount.toFixed(0) || 'N/A'}</div>
                <div>Health Score: {recipe.healthScore || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;