/**SortMenu.jsx
 * 정렬 기준 드롭다운 UI
 * value
 * onSortChange
 * optionList
 */

import React, { useState } from 'react';
import styles from '../assets/styles/SortMenu.module.css';

const SortMenu = ({ value, onChange, optionList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.sortMenuContainer}>
      <div className={styles.sortMenuHeader} onClick={handleToggle}>
        <span>{optionList.find(opt => opt.value === value)?.name || '정렬'}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.up : styles.down}`}></span>
      </div>
      {isOpen && (
        <ul className={styles.sortMenuOptions}>
          {optionList.map((opt) => (
            <li
              key={opt.value}
              className={`${styles.sortMenuItem} ${value === opt.value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(opt.value)}
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortMenu;