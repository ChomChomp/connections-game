// app/page.js - Home/Creator Page
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TestDataGenerator from './components/TestDataGenerator';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext'; // Add this import
import ShareButton from './components/ShareButton'; // Add this import

export default function Home() {
  const router = useRouter();
  const { darkMode } = useTheme(); // Get darkMode from context
  const [puzzleUrl, setPuzzleUrl] = useState(null); // Track generated URL
  const [showShareOptions, setShowShareOptions] = useState(false); // Track if share options should show
  
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
    // Reset share options if editing after creating
    if (showShareOptions) {
      setShowShareOptions(false);
      setPuzzleUrl(null);
    }
  };

  const updateWord = (categoryIndex, wordIndex, value) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].words[wordIndex] = value;
    setCategories(newCategories);
    // Reset share options if editing after creating
    if (showShareOptions) {
      setShowShareOptions(false);
      setPuzzleUrl(null);
    }
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
    
    // Create the full puzzle URL
    const fullUrl = `${window.location.origin}/play?puzzle=${encodedData}`;
    setPuzzleUrl(fullUrl);
    setShowShareOptions(true);
  };

  const playPuzzle = () => {
    if (puzzleUrl) {
      // Extract the puzzle parameter
      const urlParams = new URLSearchParams(puzzleUrl.split('?')[1]);
      const puzzleParam = urlParams.get('puzzle');
      router.push(`/play?puzzle=${puzzleParam}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen bg-[var(--background)]">
      <ThemeToggle />
      
      <h1 className="text-3xl font-bold mb-6 text-center text-[var(--foreground)]">Connections Puzzle Creator</h1>
      
      <div className="space-y-8">
        {categories.map((category, catIndex) => (
          <div 
            key={catIndex} 
            className="p-4 rounded-lg transition-colors" 
            style={{ backgroundColor: category.color + (darkMode ? '30' : '40') }}
          >
            <input
              type="text"
              placeholder={`Category ${catIndex + 1} Name`}
              value={category.name}
              onChange={(e) => updateCategory(catIndex, 'name', e.target.value)}
              className="w-full p-2 mb-3 rounded border bg-[var(--input-bg)] text-[var(--foreground)] border-[var(--input-border)]"
            />
            
            <div className="grid grid-cols-2 gap-2">
              {category.words.map((word, wordIndex) => (
                <input
                  key={wordIndex}
                  type="text"
                  placeholder={`Word ${wordIndex + 1}`}
                  value={word}
                  onChange={(e) => updateWord(catIndex, wordIndex, e.target.value)}
                  className="p-2 rounded border bg-[var(--input-bg)] text-[var(--foreground)] border-[var(--input-border)]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        {showShareOptions ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3">
              <ShareButton url={puzzleUrl} className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium text-lg transition-colors" />
              <button
                onClick={playPuzzle}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium text-lg transition-colors"
              >
                Play Now
              </button>
            </div>
            <button
              onClick={() => setShowShareOptions(false)}
              className="text-blue-600 dark:text-blue-400 underline text-sm"
            >
              Edit Puzzle
            </button>
          </div>
        ) : (
          <button
            onClick={createPuzzle}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium text-lg transition-colors"
          >
            Create Puzzle
          </button>
        )}
      </div>
      
      {/* Test Data Generator - Easy to comment out */}
      <TestDataGenerator onFill={setCategories} />
      
      <div className="mt-8 text-gray-600 dark:text-gray-400 text-sm text-center">
        <p>After creating your puzzle, you'll get a shareable link to send to friends!</p>
      </div>
    </div>
  );
}