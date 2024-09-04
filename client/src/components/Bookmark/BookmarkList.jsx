/** BookmarkList.jsx
 * 마이페이지 내 북마크한 레시피 리스트 컴포넌트
 * 
 */


import React from 'react';
import { useDispatch, useSelector } from "react-redux";

const BookmarkList = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state))
  return (
    <div>
      <OuterWrapper>
      <List items={items} />
      <ActionWrapper>
        <button onClick={handleAddOneItem}>Add one item</button>
        <button onClick={handleRemoveOneItem}>Remove one item</button>
        <button onClick={handleToggleOrder}>Toggle order</button>
      </ActionWrapper>
      <ActionWrapper>
        <button className="editBtn" onClick={handleOpenEditModal}>
          Edit list content
        </button>
      </ActionWrapper>
    </OuterWrapper>
    </div>
  );
};

export default BookmarkList;