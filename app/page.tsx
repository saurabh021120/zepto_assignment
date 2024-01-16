"use client";
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Chip {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [items, setItems] = useState<string[]>([
    'Nick Giannopoulos',
    'John Doe',
    'Jane Doe',
    'Alice Smith',
    'Saurabh Sharma',
    'Ajay Varma',
    'HM Shastri',
    'John Smith',
    'Alan Done',
    'Sue Susan'
  ]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handleDocumentClick = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setFilteredItems([]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setFilteredItems(items);
      setSelectedItemIndex(null);
    }

    const filtered = items.filter(item => item.toLowerCase().includes(value.toLowerCase()));
    setFilteredItems(filtered);
    setSelectedItemIndex(filtered.length > 0 ? 0 : null);
  };

  const handleItemClick = (item: string) => {
    setChips(prevChips => [...prevChips, { id: Date.now(), name: item }]);
    setInputValue('');
    setItems(prevItems => prevItems.filter(prevItem => prevItem !== item));
    setFilteredItems(prevItems => prevItems.filter(prevItem => prevItem !== item));
  };

  const handleChipRemove = (chipId: number) => {
    const removedChip = chips.find(chip => chip.id === chipId);
    if (removedChip) {
      setChips(chips.filter(chip => chip.id !== chipId));
      setItems(prevItems => [...prevItems, removedChip.name]);
      setFilteredItems(prevItems => [...prevItems, removedChip.name]);
    }
    setSelectedChip(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' && selectedChip === null) {
      event.preventDefault();
      setSelectedItemIndex(prevIndex => (prevIndex !== null ? Math.max(prevIndex - 1, 0) : null));
    } else if (event.key === 'ArrowDown' && selectedChip === null) {
      event.preventDefault();
      setSelectedItemIndex(prevIndex =>
        prevIndex !== null ? Math.min(prevIndex + 1, filteredItems.length - 1) : 0
      );
    } else if (event.key === 'Enter' && selectedItemIndex !== null) {
      event.preventDefault();
      handleItemClick(filteredItems[selectedItemIndex]);
    }else if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      if (selectedChip === null) {
        setSelectedChip(lastChip.id);
      } else {
        handleChipRemove(lastChip.id);
      }
    }
  }

  const handleOnClick = () => {
    handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chips]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);


  return (
    <div className="container mx-auto my-8 max-w-md">
      <h1 className='items-center text-center'> ZEPTO</h1>
      <div className="flex flex-wrap">
        {chips.map(chip => (
          <div key={chip.id} className={`${
            selectedChip === chip.id ? 'bg-black text-white rounded-2xl' : 'bg-gray-500 text-white rounded-2xl'
          } px-2 py-1 m-1 flex items-center`}>
            {chip.name}
            <button
              className="ml-2"
              onClick={() => handleChipRemove(chip.id)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="border-b border-gray-300 p-2 mt-2 w-full focus:outline-none focus:border-b focus:border-black"
        placeholder="Add new user..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={handleOnClick}
      />
      <div className="mt-2">
        {filteredItems.map((item,index) => (
          <div
            key={item}
            className={`${
              selectedItemIndex === index ? 'bg-gray-200' : ''
            } cursor-pointer p-2 border border-gray-300 mt-1`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// @ts-ignore
export default App;
