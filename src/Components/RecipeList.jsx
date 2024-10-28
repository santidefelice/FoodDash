// RecipeList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function RecipeList({ recipes, setRecipes }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  }, [setRecipes]);

  const filteredRecipes = recipes.filter(recipe => {
    if (!recipe || !recipe.title) return false;
    
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || 
      (recipe.cuisines && Array.isArray(recipe.cuisines) && recipe.cuisines.map(cuisine => 
        cuisine.toLowerCase()).includes(cuisineFilter.toLowerCase()));
    const matchesDiet = dietFilter === 'all' || 
      (recipe.diets && Array.isArray(recipe.diets) && recipe.diets.map(diet => 
        diet.toLowerCase()).includes(dietFilter.toLowerCase()));
    
    return matchesSearch && matchesCuisine && matchesDiet;
  });

  const handleNavigateToDetails = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Chart data preparation (keeping your existing code)
  const cuisineData = recipes.reduce((acc, recipe) => {
    recipe.cuisines?.forEach(cuisine => {
      acc[cuisine] = (acc[cuisine] || 0) + 1;
    });
    return acc;
  }, {});

  const chartData = Object.entries(cuisineData)
    .map(([cuisine, count]) => ({
      name: cuisine,
      count: count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

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
      {/* Chart Section */}
      <div className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Recipe Distribution by Cuisine</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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

      {/* Recipe Cards */}
      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-center p-4">{error}</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredRecipes.map(recipe => (
            <div 
              key={recipe.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div 
                className="cursor-pointer"
                onClick={() => handleNavigateToDetails(recipe.id)}
              >
                <div className="relative">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 hover:text-blue-600">{recipe.title}</h3>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Calories:</span>
                      <span>{recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount.toFixed(0) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Score:</span>
                      <span>{recipe.healthScore || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => handleNavigateToDetails(recipe.id)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;