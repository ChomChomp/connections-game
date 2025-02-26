// app/play/page.js - Puzzle Play Page
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Play() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [puzzle, setPuzzle] = useState(null);
  const [gameState, setGameState] = useState({
    selectedWords: [],
    completedCategories: [],
    mistakes: 0,
    shuffledWords: [],
  });
  const [message, setMessage] = useState('');
  const [isMessageError, setIsMessageError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return; // Skip server-side execution
    
    // Get the puzzle data from the URL
    const encodedPuzzle = searchParams?.get('puzzle');
    
    if (encodedPuzzle) {
      try {
        // Decode the puzzle data
        const decodedData = Buffer.from(encodedPuzzle, 'base64').toString();
        const parsedPuzzle = JSON.parse(decodedData);
        setPuzzle(parsedPuzzle);
        
        // Create shuffled list of all words
        const allWords = parsedPuzzle.flatMap(category => 
          category.words.map(word => ({
            text: word,
            category: category.name,
            color: category.color,
          }))
        );
        
        // Shuffle the words
        const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
        setGameState(prev => ({ ...prev, shuffledWords }));
        
      } catch (error) {
        console.error('Error parsing puzzle:', error);
        setMessage('Invalid puzzle data. Please check your link.');
        setIsMessageError(true);
      }
    } else {
      setMessage('No puzzle found. Ask your friend for a valid puzzle link!');
      setIsMessageError(true);
    }
  }, [searchParams, isClient]);

  const handleWordSelect = (wordIndex) => {
    const word = gameState.shuffledWords[wordIndex];
    
    // Skip if word is already part of a completed category
    if (gameState.completedCategories.some(cat => 
      cat.words.some(w => w.text === word.text))) {
      return;
    }
    
    // Add or remove word from selection
    let newSelectedWords = [...gameState.selectedWords];
    const existingIndex = newSelectedWords.findIndex(w => w.text === word.text);
    
    if (existingIndex >= 0) {
      newSelectedWords.splice(existingIndex, 1);
    } else {
      if (newSelectedWords.length < 4) {
        newSelectedWords.push(word);
      }
    }
    
    setGameState(prev => ({ ...prev, selectedWords: newSelectedWords }));
    
    // Check if we have a complete group
    if (newSelectedWords.length === 4) {
      checkSelection(newSelectedWords);
    }
  };
  
  const checkSelection = (selectedWords) => {
    // Get all category names from selection
    const categories = selectedWords.map(w => w.category);
    
    // Check if all words belong to the same category
    const isCorrect = categories.every(c => c === categories[0]);
    
    if (isCorrect) {
      // Correct group!
      const categoryName = categories[0];
      const categoryColor = selectedWords[0].color;
      
      setGameState(prev => {
        const updated = {
          ...prev,
          selectedWords: [],
          completedCategories: [
            ...prev.completedCategories, 
            { name: categoryName, words: selectedWords, color: categoryColor }
          ],
        };
        
        // Check if game is complete (all 4 categories found)
        if (updated.completedCategories.length === 4) {
          setMessage('Congratulations! You solved the puzzle!');
          setIsMessageError(false);
        } else {
          setMessage('Correct group found!');
          setIsMessageError(false);
          setTimeout(() => setMessage(''), 2000);
        }
        
        return updated;
      });
    } else {
      // Incorrect group
      setGameState(prev => ({
        ...prev,
        selectedWords: [],
        mistakes: prev.mistakes + 1,
      }));
      
      setMessage('Incorrect grouping. Try again!');
      setIsMessageError(true);
      setTimeout(() => setMessage(''), 2000);
    }
  };
  
  const createNewPuzzle = () => {
    router.push('/');
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setMessage('Link copied to clipboard!');
    setIsMessageError(false);
    setTimeout(() => setMessage(''), 2000);
  };
  
  // For the return statement, conditionally render based on isClient
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!puzzle) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">{message || 'Loading puzzle...'}</h1>
          {message && (message.includes('Invalid') || message.includes('No puzzle')) && (
            <button
              onClick={createNewPuzzle}
              className="mt-6 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 px-6 rounded-lg font-medium text-lg"
            >
              Create a New Puzzle
            </button>
          )}
        </div>
      </div>
    );
  }

  const isWordSelected = (word) => {
    return gameState.selectedWords.some(w => w.text === word.text);
  };
  
  const isWordCompleted = (word) => {
    return gameState.completedCategories.some(cat => 
      cat.words.some(w => w.text === word.text)
    );
  };
  
  const getWordCategory = (word) => {
    return gameState.completedCategories.find(cat => 
      cat.words.some(w => w.text === word.text)
    );
  };

  const renderMistakesIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-5">
        <span className="mr-2 font-medium">Mistakes:</span>
        <div className="flex space-x-1">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full ${i < gameState.mistakes ? 'bg-red-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Connections</h1>
        <div>
          <button
            onClick={copyShareLink}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg mr-2 font-medium transition-colors"
          >
            Share
          </button>
          <button
            onClick={createNewPuzzle}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            New Puzzle
          </button>
        </div>
      </div>
      
      {message && (
        <div className={`mb-6 p-3 text-center rounded-lg shadow-sm ${
          isMessageError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          <p className="font-medium">{message}</p>
        </div>
      )}
      
      {renderMistakesIndicator()}
      
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {gameState.selectedWords.map((word, index) => (
            <div
              key={index}
              className="h-16 flex items-center justify-center bg-yellow-100 border-2 border-yellow-500 rounded-lg p-2 text-center font-medium cursor-pointer shadow-sm hover:shadow-md transition-shadow"
              onClick={() => handleWordSelect(gameState.shuffledWords.findIndex(w => w.text === word.text))}
            >
              <span className="text-gray-800">{word.text}</span>
            </div>
          ))}
          {Array(4 - gameState.selectedWords.length).fill(0).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-16 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-2"
            ></div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="grid grid-cols-4 gap-3">
          {gameState.shuffledWords.map((word, index) => {
            const completed = isWordCompleted(word);
            const category = completed ? getWordCategory(word) : null;
            const selected = isWordSelected(word);
            
            return (
              <div
                key={index}
                className={`h-16 flex items-center justify-center rounded-lg p-2 text-center font-medium transition-all 
                  ${completed 
                    ? 'text-white shadow-md' 
                    : selected
                    ? 'bg-yellow-100 border-2 border-yellow-500 shadow-md hover:shadow-lg scale-[1.02]'
                    : 'bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                style={completed ? { backgroundColor: category.color } : {}}
                onClick={() => handleWordSelect(index)}
              >
                <span className={completed ? 'text-white' : 'text-gray-800'}>
                  {word.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="space-y-3 mt-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Solved Categories:</h2>
        {gameState.completedCategories.map((category, index) => (
          <div
            key={index}
            className="p-3 rounded-lg text-white text-center font-medium shadow-md"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {category.words.map((word, wordIndex) => (
                <div key={wordIndex} className="bg-white bg-opacity-20 p-1 rounded text-sm">
                  {word.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}