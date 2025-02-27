"use client";

export default function TestDataGenerator({ onFill }) {
  // Sample test data
  const testData = [
    { 
      name: 'Animals', 
      words: ['Elephant', 'Giraffe', 'Zebra', 'Lion'], 
      color: '#f8ca9d' 
    },
    { 
      name: 'Fruits', 
      words: ['Apple', 'Banana', 'Orange', 'Strawberry'], 
      color: '#a0c1b9' 
    },
    { 
      name: 'Countries', 
      words: ['France', 'Japan', 'Brazil', 'Canada'], 
      color: '#70a0af' 
    },
    { 
      name: 'Programming Languages', 
      words: ['JavaScript', 'Python', 'Java', 'C++'], 
      color: '#725e82' 
    },
  ];

  const fillTestData = () => {
    onFill(testData);
  };

  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={fillTestData}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg font-medium text-lg transition-colors"
      >
        Fill Test Data
      </button>
    </div>
  );
}