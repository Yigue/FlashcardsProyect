'use client';

import { useState, useEffect } from 'react';
import TextInput from '../components/TextInput';
import Summary from '../components/Summary';
import Flashcards from '../components/Flashcards';
import FolderSystem from '../components/FolderSystem';
import { useTheme } from '../components/ThemeProvider';
import { DragDropContext } from '@hello-pangea/dnd';
import { useStore } from '../store/store';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { folders, addFolder, moveItem } = useStore();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    moveItem(result.source, result.destination);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className={`flex min-h-screen flex-col items-center justify-start p-8 ${theme}`}>
        <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <h1 className="text-4xl font-bold mb-8">Generador de Resúmenes y Flashcards</h1>
        <TextInput />
        <FolderSystem folders={folders} />
      </main>
    </DragDropContext>
  );
}