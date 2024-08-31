import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, Modal} from "react-bootstrap";

const UserCategoryModifyModal = ({ show, userCategories, setUserCategories, setShowUserCategories, user}) => {
    const API_URL = import.meta.env.VITE_HOST_IP;

    const [categories, setCategories] = useState([]);

    let selectedCategoriesList = [...userCategories];

    // 모든 카테고리 내용 가져오는 코드 시작
    const getCategories = async () => {
d
        try {
            const response = await fetch(`${API_URL}/api/allCategoryName`);
            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();

            console.log("모든 카테고리 목록 호출 성공!");

            setCategories(result);

        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {

        getCategories();

    }, []);
    // 모든 카테고리 내용 가져오는 코드 끝

    // 카테고리 버튼을 클릭하면, 리스트에 선택된 카테고리 이름이 들어가고,
    // 선택해제하면 리스트에서 이름이 삭제된다.
    const updateCategoriesListener = (e) => {

        e.target.classList.toggle('active');

        if (e.target.className.indexOf('active') === -1) {
            selectedCategoriesList = selectedCategoriesList.filter(category => category !== e.target.innerText);
        } else {
            selectedCategoriesList.push(e.target.innerText);
        }

    }


    // 변경 승인 함수
    const userCategoryConfirm = async () => {

        console.log(selectedCategoriesList)
        // 기존 카테고리 삭제
        try {
            const response = await fetch(`${API_URL}/api/updateUserCategories`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_id: user.user_id})
            });

            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();

            console.log('유저의 기존 카테고리 삭제 성공!');

        } catch (e) {
            console.log(e);
        }
        
        // 새로운 카테고리 내역으로 저장
        try {
            const response = await fetch(`${API_URL}/api/updateUserCategories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({categories: selectedCategoriesList, user_id: user.user_id})
            });

            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();

            console.log('유저의 새로운 카테고리 저장 성공!');

            setUserCategories([...selectedCategoriesList]);

        } catch (e) {
            console.log(e);
        }
    }

    const userCategoryCancel = useCallback(() => {
        console.log('카테고리 변경 취소');
        setShowUserCategories(false);
    });

    return (
        <Modal show={show} onHide={userCategoryCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {categories.map( // 모든 카테고리 내역을 화면에 보여주면서 해당 유저가 선택해놓은 카테고리를 선택 표시해둔다.
                    (category, idx) => {
                        if (userCategories.includes(category)) {
                            return <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2 active" onClick={updateCategoriesListener} >{category}</Button>
                        }
                        return <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2" onClick={updateCategoriesListener} >{category}</Button>
                    })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={userCategoryConfirm}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={userCategoryCancel}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UserCategoryModifyModal;