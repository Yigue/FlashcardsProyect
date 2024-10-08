'use client';

import { useState } from 'react';
import { useStore } from '../store/store';

export default function TextInput() {
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Sin categoría');
  const [isLoading, setIsLoading] = useState(false);
  const { addSummary, categories, addCategory } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate summary and flashcards');
      }
      const data = await response.json();
      const tagArray = tags.split(',').map((tag) => tag.trim());
      addSummary(data.summary, data.flashcards, tagArray, category);
      setText('');
      setTags('');
      setCategory('Sin categoría');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate summary and flashcards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Ingrese el nombre de la nueva categoría:');
    if (newCategory && !categories.includes(newCategory)) {
      addCategory(newCategory);
      setCategory(newCategory);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
      <textarea
        className="w-full h-40 p-2 border border-gray-300 rounded text-gray-800 bg-white dark:bg-gray-700 dark:text-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ingrese su texto aquí..."
      />
      <input
        type="text"
        className="w-full mt-2 p-2 border border-gray-300 rounded text-gray-800 bg-white dark:bg-gray-700 dark:text-white"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Etiquetas (separadas por comas)"
      />
      <div className="flex mt-2">
        <select
          className="flex-grow p-2 border border-gray-300 rounded text-gray-800 bg-white dark:bg-gray-700 dark:text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAddCategory}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isLoading}
      >
        {isLoading ? 'Generando...' : 'Generar Resumen y Flashcards'}
      </button>
    </form>
  );
}