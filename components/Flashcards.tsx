'use client';

import { useState, useEffect } from 'react';

type Flashcard = {
  question: string;
  answer: string;
};

export default function Flashcards({ flashcards = [] }: { flashcards: Flashcard[] }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setCurrentCard(0);
    setShowAnswer(false);
  }, [flashcards]);

  const flipCard = () => setShowAnswer(!showAnswer);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  if (flashcards.length === 0) {
    return (
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
        <p className="text-gray-600 dark:text-gray-400">Las flashcards aparecerán aquí después de la generación.</p>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentCard];

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
      {currentFlashcard && (
        <>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md p-6 mb-4">
            <div className="text-center mb-4">
              {showAnswer ? currentFlashcard.answer : currentFlashcard.question}
            </div>
            <button
              onClick={flipCard}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showAnswer ? 'Mostrar Pregunta' : 'Mostrar Respuesta'}
            </button>
          </div>
          <div className="flex justify-between">
            <button
              onClick={prevCard}
              className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Anterior
            </button>
            <span className="py-2 px-4 text-gray-600 dark:text-gray-400">
              {currentCard + 1} / {flashcards.length}
            </span>
            <button
              onClick={nextCard}
              className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}