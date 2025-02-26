// app/page.js - Home/Creator Page
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([
    { name: '', words: ['', '', '', ''], color: '#f8ca9d' },
    { name: '', words: ['', '', '', ''], color: '#a0c1b9' },
    { name: '', words: ['', '', '', ''], color: '#70a0af' },
    { name: '', words: ['', '', '', ''], color: '#725e82' },
  ]);

  const updateCategory = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const updateWord = (categoryIndex, wordIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].words[wordIndex] = value;
    setCategories(newCategories);
  };

  const createPuzzle = () => {
    // Validate all fields are filled
    for (const category of categories) {
      if (!category.name.trim()) return alert('All category names must be filled');
      for (const word of category.words) {
        if (!word.trim()) return alert('All words must be filled');
      }
    }

    // Create the puzzle data
    const puzzleData = JSON.stringify(categories);
    
    // Encode the data for URL safety
    const encodedData = Buffer.from(puzzleData).toString('base64');
    
    // Navigate to the play page with the puzzle data
    router.push(`/play?puzzle=${encodedData}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Connections Puzzle</h1>
      
      <div className="space-y-8">
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="p-4 rounded-lg" style={{ backgroundColor: category.color + '40' }}>
            <input
              type="text"
              placeholder={`Category ${catIndex + 1} Name`}
              value={category.name}
              onChange={(e) => updateCategory(catIndex, 'name', e.target.value)}
              className="w-full p-2 mb-3 rounded border"
            />
            
            <div className="grid grid-cols-2 gap-2">
              {category.words.map((word, wordIndex) => (
                <input
                  key={wordIndex}
                  type="text"
                  placeholder={`Word ${wordIndex + 1}`}
                  value={word}
                  onChange={(e) => updateWord(catIndex, wordIndex, e.target.value)}
                  className="p-2 rounded border"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={createPuzzle}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium text-lg"
        >
          Create Puzzle
        </button>
      </div>
      
      <div className="mt-8 text-gray-600 text-sm text-center">
        <p>After creating your puzzle, you'll get a shareable link to send to friends!</p>
      </div>
    </div>
  );
}