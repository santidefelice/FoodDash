// components/RecipeDetail.jsx
import { Link, useParams } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function RecipeDetail({ recipes }) {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === parseInt(id));

  if (!recipe) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">Recipe not found</div>
        <Link to="/" className="text-blue-500 hover:text-blue-700">Return to Recipe List</Link>
      </div>
    );
  }

  // Prepare nutrition data for pie chart
  const nutritionData = [
    { name: 'Protein', value: recipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0 },
    { name: 'Carbs', value: recipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0 },
    { name: 'Fat', value: recipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
        ← Back to Recipe List
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">{recipe.title}</h1>

          {/* Nutrition Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Macronutrient Distribution</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={nutritionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Details</h2>
              <div className="text-gray-600">
                <p>Ready in: {recipe.readyInMinutes} minutes</p>
                <p>Servings: {recipe.servings}</p>
                <p>Health Score: {recipe.healthScore}</p>
                <p>Calories: {recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount.toFixed(0) || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Dietary Info</h2>
              <div className="text-gray-600">
                {recipe.diets?.length > 0 && (
                  <p>Diets: {recipe.diets.join(', ')}</p>
                )}
                {recipe.cuisines?.length > 0 && (
                  <p>Cuisines: {recipe.cuisines.join(', ')}</p>
                )}
              </div>
            </div>
          </div>

          {recipe.summary && (
            <div>
              <h2 className="text-xl font-bold mb-2">Summary</h2>
              <div 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;