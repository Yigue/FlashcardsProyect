'use client';

import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Summary from './Summary';
import Flashcards from './Flashcards';
import { useStore } from '../store/store';

const FolderSystem = ({ folders }) => {
  const [activeFolder, setActiveFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addFolder, searchItems } = useStore();

  const handleAddFolder = () => {
    const folderName = prompt('Ingrese el nombre de la nueva carpeta:');
    if (folderName) {
      addFolder(folderName);
    }
  };

  const filteredItems = searchQuery ? searchItems(searchQuery) : [];

  return (
    <div className="w-full flex flex-col">
      <div className="w-full mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded text-gray-800 bg-white dark:bg-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar resúmenes..."
        />
      </div>
      <div className="w-full flex">
        <div className="w-1/4 pr-4">
          <h2 className="text-2xl font-bold mb-4">Carpetas</h2>
          <button
            onClick={handleAddFolder}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Añadir Carpeta
          </button>
          <Droppable droppableId="folders">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {folders.map((folder, index) => (
                  <Draggable key={folder.id} draggableId={folder.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-2 mb-2 rounded cursor-pointer ${
                          activeFolder === folder.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        onClick={() => setActiveFolder(folder.id)}
                      >
                        {folder.name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
        <div className="w-3/4">
          {searchQuery ? (
            filteredItems.map((item) => (
              <div key={item.id} className="mb-8">
                <Summary summary={item.summary} tags={item.tags || []} category={item.category} />
                <Flashcards flashcards={item.flashcards} />
              </div>
            ))
          ) : (
            activeFolder && (
              <Droppable droppableId={activeFolder}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {folders
                      .find((folder) => folder.id === activeFolder)
                      ?.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-8"
                            >
                              <Summary summary={item.summary} tags={item.tags || []} category={item.category} />
                              <Flashcards flashcards={item.flashcards} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderSystem;