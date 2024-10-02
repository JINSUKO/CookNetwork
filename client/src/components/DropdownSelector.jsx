/** DropdownSelector.jsx
 * 레시피 등록페이지의 재료 선택 입력 필드를 위한 드롭다운 컴포넌트입니다.
 * 데이터베이스의 재료 데이터를 불러와 드롭다운 목록을 구성합니다.
 * 유저가 재료명 입력 필드에 타이핑하면 드롭다운이 열리고 필터링된 재료 리스트가 표시됩니다.
 */

import React, { useState, useEffect } from 'react';
import styles from '../assets/styles/DropdownSelector.module.css';

const DropdownSelector = ({ onIngredientSelect }) => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 재료 데이터 fetch
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_HOST_IP}/api/writeRecipe`);
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients');
      }
      const data = await response.json();
      setIngredients(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  // 재료명을 입력하면 드롭다운이 열림
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    const filtered = ingredients.filter(ingredient =>
      ingredient.ingredient_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredIngredients(filtered);
  };

  // 재료 선택
  const handleSelect = (ingredient) => {
    setInputValue(ingredient.ingredient_name);
    setIsOpen(false);
    onIngredientSelect(ingredient.ingredient_name);
  };

  return (
    <div className={styles.dropdownContainer}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        placeholder="재료명"
        className={styles.input}
      />
      {isOpen  && (
        <ul className={styles.dropdown}>
          {filteredIngredients.map((ingredient, index) => (
            <li key={index} onClick={() => handleSelect(ingredient)} className={styles.dropdownItem}>
              {ingredient.ingredient_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelector;