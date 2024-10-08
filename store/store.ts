import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

type SummaryItem = {
  id: string;
  summary: string;
  flashcards: Flashcard[];
  tags: string[];
  category: string;
};

type Folder = {
  id: string;
  name: string;
  items: SummaryItem[];
};

type Store = {
  folders: Folder[];
  categories: string[];
  addFolder: (name: string) => void;
  addSummary: (summary: string, flashcards: Flashcard[], tags: string[], category: string) => void;
  moveItem: (source: any, destination: any) => void;
  addCategory: (category: string) => void;
  searchItems: (query: string) => SummaryItem[];
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      folders: [],
      categories: ['Sin categoría'],
      addFolder: (name) =>
        set((state) => ({
          folders: [...state.folders, { id: Date.now().toString(), name, items: [] }],
        })),
      addSummary: (summary, flashcards, tags, category) =>
        set((state) => {
          const newItem = { id: Date.now().toString(), summary, flashcards, tags, category };
          const updatedFolders = [...state.folders];
          if (updatedFolders.length === 0) {
            updatedFolders.push({ id: 'default', name: 'Default', items: [newItem] });
          } else {
            updatedFolders[0].items.push(newItem);
          }
          return { folders: updatedFolders };
        }),
      moveItem: (source, destination) =>
        set((state) => {
          const newFolders = [...state.folders];
          const sourceFolder = newFolders.find((folder) => folder.id === source.droppableId);
          const destFolder = newFolders.find((folder) => folder.id === destination.droppableId);

          if (!sourceFolder || !destFolder) return state;

          const [movedItem] = sourceFolder.items.splice(source.index, 1);
          destFolder.items.splice(destination.index, 0, movedItem);

          return { folders: newFolders };
        }),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      searchItems: (query) => {
        const { folders } = get();
        const allItems = folders.flatMap((folder) => folder.items);
        return allItems.filter(
          (item) =>
            item.summary.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
      },
    }),
    {
      name: 'folder-storage',
    }
  )
);