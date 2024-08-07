import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, Modal} from "react-bootstrap";

const UserCategoryModifyModal = ({ show, userCategories, setShowUserCategories, loginUser}) => {
    const API_URL = import.meta.env.VITE_HOST_IP;

    console.log('userCategories', userCategories);

    // [{a:b}, {a,c}, ...] => { a: [ b, c, ...]} 로 변경하는 함수 코드.
    let userCategoriesList = (() => {
        if (userCategories != null) {
            return userCategories.reduce((acc, curr) => {
                Object.keys(curr).forEach(key => {
                    if (!acc[key]) {
                        acc[key] = []
                    };
                    acc[key].push(curr[key]);
                })
                return acc;
            }, {})
        }

    })();

    const [categories, setCategories] = useState([]);

    const parentCategoryDiv = useRef('');

    // 모든 카테고리 내용 가져오는 코드 시작
    const getCategories = async () => {

        try {
            const response = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_id: loginUser.user_id})
            });
            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();

            console.log("모든 카테고리 목록 호출 성공!");

            setCategories(result);

            // console.log('parentCategoryDiv', parentCategoryDiv)
            // if (parentCategoryDiv.current) {
            //     const list = [...(parentCategoryDiv.current.children)];
            //     list.forEach((e) => {
            //         console.log('userCategories.contains(e.innerText)', userCategories.contains(e.innerText))
            //         if (userCategories.contains(e.innerText)) {
            //             e.classList.add('active');
            //         }
            //
            //     })
            // }

        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {

        getCategories();

    }, []);
    // 모든 카테고리 내용 가져오는 코드 끝

    // 모달이 띄워진 후에 이 코드가 실행된다.
    useEffect(() => {

        if (parentCategoryDiv.current) {

            const list = [...(parentCategoryDiv.current.children)];
            const selectedCateList = list.map((e) => {
                console.log(e.className.indexOf('active'));
                if (e.className.indexOf('active') !== -1) {
                    return e.innerText;
                }
            }).filter(e => (e));

            console.log(selectedCateList);

        }
    }, [parentCategoryDiv.current]);


    const updateCategoriesListener = (e) => {
        e.target.classList.toggle('active');
    }


    // 변경 승인 함수
    const userCategoryConfirm = async () => {

        try {
            const response = await fetch(`${API_URL}/api/userCategoriesInsert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({categories: categories, user_id: loginUser.user_id})
            });

            if (!response.ok) throw new Error((await response.json()).error);

            const result = await response.json();
            setUsername(postUsername)

            loginUser.username = postUsername;

            localStorage.setItem('loginUser', JSON.stringify(loginUser));

            console.log('유저의 카테고리 설정 성공!');


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
            <Modal.Body ref={parentCategoryDiv}>
                {categories.map(
                    (category, idx) => {
                        if (userCategoriesList.category_name.includes(category.category_name)) {
                            return <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2 active" onClick={updateCategoriesListener} >{category.category_name}</Button>
                        }
                        return <Button key={idx} variant="outline-secondary" size="sm" className="me-2 mb-2" onClick={updateCategoriesListener} >{category.category_name}</Button>
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