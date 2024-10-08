import React from 'react';

interface SummaryProps {
  summary: string;
  tags: string[];
  category: string;
}

export default function Summary({ summary, tags = [], category }: SummaryProps) {
  return (
    <div className="w-full max-w-2xl mb-4">
      <h2 className="text-2xl font-bold mb-2">Resumen</h2>
      <p className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
        {summary || 'El resumen del texto aparecerá aquí después de la generación.'}
      </p>
      <div className="mt-2">
        <span className="font-bold">Categoría: </span>
        <span className="bg-blue-500 text-white px-2 py-1 rounded">{category}</span>
      </div>
      <div className="mt-2">
        <span className="font-bold">Etiquetas: </span>
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mr-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}