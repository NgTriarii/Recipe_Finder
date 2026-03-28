'use client';

import { useState } from 'react';
import { ChefHat, Search, AlertTriangle, Maximize2, Minimize2, Clock, Utensils } from 'lucide-react';

interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
  isAiGenerated: boolean;
  sourceUrl?: string;
}

export default function SemanticRecipeFinder() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isCookMode, setIsCookMode] = useState(false);

  const handleFindRecipe = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setRecipe(null);
    setIsCookMode(false);

    try {
      // We now call our secure backend route instead of the Gemini API directly
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecipe(data);
      
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      alert("Oops! Our AI chef had a hiccup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- EVERYTHING BELOW THIS LINE IS UNCHANGED --- //

  if (isCookMode && recipe) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-50 p-6 md:p-12 font-sans selection:bg-amber-500/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12 border-b border-stone-700 pb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-400">{recipe.title}</h1>
            <button 
              onClick={() => setIsCookMode(false)}
              className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-6 py-3 rounded-full transition-colors text-lg font-medium"
            >
              <Minimize2 className="w-6 h-6" />
              Exit Cook Mode
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1 bg-stone-800/50 p-8 rounded-3xl h-fit">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-amber-200">
                <Utensils className="w-6 h-6" />
                Ingredients
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="text-xl text-stone-300 flex items-start gap-3">
                    <span className="text-amber-500 mt-1">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-12">
              <h2 className="text-3xl font-semibold flex items-center gap-3 text-amber-200">
                <Clock className="w-8 h-8" />
                Steps
              </h2>
              <div className="space-y-12">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-amber-500 text-stone-900 rounded-full flex items-center justify-center text-3xl font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-3xl md:text-4xl font-bold leading-tight text-stone-100 pt-2">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800 font-sans selection:bg-amber-200">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-16 justify-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-700">Semantic Recipe Finder</h1>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-12 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            What&apos;s in the fridge? <br className="hidden md:block" />
            <span className="text-amber-600 font-serif italic font-medium">We&apos;ll figure out dinner.</span>
          </h2>
          <p className="text-lg text-stone-500 max-w-xl mx-auto">
            Just tell us what ingredients you have and how you&apos;re feeling. We&apos;ll handle the rest.
          </p>
        </section>

        {/* Search Section */}
        <section className="bg-white p-4 md:p-6 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 mb-12">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I have wilted kale, a lemon, frozen tilapia. I'm tired and have 15 mins."
              className="w-full h-32 md:h-40 p-6 bg-stone-50 rounded-2xl border-0 focus:ring-2 focus:ring-amber-400/50 resize-none text-lg md:text-xl text-stone-700 placeholder:text-stone-400 transition-shadow"
              disabled={isLoading}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleFindRecipe}
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <ChefHat className="w-6 h-6 animate-bounce" />
                  Checking the pantry...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  Find Recipe
                </>
              )}
            </button>
          </div>
        </section>

        {/* Recipe Result Section */}
        {recipe && !isLoading && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Warning Banner or Source Link */}
            {recipe.isAiGenerated ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3 text-amber-800">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 text-amber-500 mt-0.5" />
                <p className="text-sm md:text-base font-medium leading-relaxed">
                  <strong>AI-Generated Recipe:</strong> We couldn&apos;t find an exact match online, so our AI Chef improvised!
                </p>
              </div>
            ) : recipe.sourceUrl ? (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-8 flex items-center gap-3 text-stone-600">
                <Search className="w-5 h-5 flex-shrink-0 text-stone-400" />
                <p className="text-sm md:text-base font-medium">
                  <strong>Source:</strong> Found online at <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline break-all">{recipe.sourceUrl}</a>
                </p>
              </div>
            ) : null}

            {/* Recipe Card */}
            <div className="bg-white rounded-3xl shadow-lg shadow-stone-200/50 border border-stone-100 overflow-hidden">
              <div className="p-8 md:p-10 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h3 className="text-3xl font-bold text-stone-900 font-serif">{recipe.title}</h3>
                <button
                  onClick={() => setIsCookMode(true)}
                  className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-full font-medium transition-colors flex-shrink-0"
                >
                  <Maximize2 className="w-5 h-5" />
                  Cook Mode
                </button>
              </div>
              
              <div className="p-8 md:p-10 grid md:grid-cols-3 gap-10">
                <div className="md:col-span-1">
                  <h4 className="text-lg font-bold text-stone-900 mb-4 uppercase tracking-wider text-sm">Ingredients</h4>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-stone-600 flex items-start gap-2">
                        <span className="text-amber-500 mt-1.5 text-xs">●</span>
                        <span className="leading-relaxed">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-lg font-bold text-stone-900 mb-6 uppercase tracking-wider text-sm">Instructions</h4>
                  <div className="space-y-6">
                    {recipe.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-stone-700 leading-relaxed pt-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}