/* SearchBarImage.jsx
사용자에게 이미지 파일를 입력받아 검색 기능을 수행합니다.
메인 상단 검색창, 버튼은 부트스트랩을 사용하였습니다.
*/

import React, {useEffect, useRef, useState} from "react";
import {Button, Form} from "react-bootstrap";

import style from "../assets/styles/SearchBarImage.module.css";

const SearchBarImage = () => {
    const [show, setShow] = useState(false);

    const fileInput = useRef(null);
    const fileInputDisplay = useRef(null);
    const speechBubble = useRef(null);
    const button = useRef(null);

    const fileInputClick = () => {
        fileInput.current.click();
    };

    const fileInputChange = () => {

    }

    const handleSearch = (e) => {
        e.preventDefault();
    }

    const updateModalPosition = () => {
        if (fileInputDisplay.current && speechBubble.current) {
            const rect = fileInputDisplay.current.getBoundingClientRect();
            speechBubble.current.style.top = `${rect.bottom + 10}px`;
            speechBubble.current.style.left = `${rect.left}px`;
        }
    };

    const handleResize = () => {
        requestAnimationFrame(updateModalPosition);
    };

    const handleClickHtmlBody = (event) => {
        if (button.current?.contains(event.target) && !fileInput.current.files[0]) {
            setShow(true);

            updateModalPosition()

            fileInputDisplay.current.style.borderColor = '#86b7fe';
            fileInputDisplay.current.style.border= '1px solid #ccc';
            fileInputDisplay.current.style.boxShadow = '0 0 0 .25rem rgba(13, 110, 253, .25)';
            fileInputDisplay.current.style.transform = 'scale(1)';
        } else {
            setShow(false);

            fileInputDisplay.current.style.borderColor = '#cccccc';
            fileInputDisplay.current.style.boxShadow = 'none';
        }
    }

    const handleScrollHtmlBody = (event) => {
        if (button.current?.contains(event.target) && !fileInput.current.files[0]) {
            setShow(true);

            speechBubble.current.style.top = `${fileInputDisplay.current.getBoundingClientRect().bottom + 10}px`;
            speechBubble.current.style.left = `${fileInputDisplay.current.getBoundingClientRect().left}px`;

            fileInputDisplay.current.style.borderColor = '#86b7fe';
            fileInputDisplay.current.style.border= '1px solid #ccc';
            fileInputDisplay.current.style.boxShadow = '0 0 0 .25rem rgba(13, 110, 253, .25)';
        } else {
            setShow(false);

            fileInputDisplay.current.style.borderColor = '#cccccc';
            fileInputDisplay.current.style.boxShadow = 'none';
        }
    }

    useEffect(() => {

        document.addEventListener('mousedown', handleClickHtmlBody);
        document.addEventListener('scroll', handleScrollHtmlBody);
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClickHtmlBody);
            document.removeEventListener('scroll', handleScrollHtmlBody);
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <div>
            <Form className={style.searchForm} style={{position: 'relative'}}>
                <Form.Control
                    type="file"
                    className={style.customFileInput}
                    accept="image/*"
                    ref={fileInput}
                    onChange={fileInputChange}
                    required
                />
                <label className={style.customFileLabel} onClick={fileInputClick} ref={fileInputDisplay}>
                    파일 선택
                </label>
                <Button
                    type="submit"
                    className={style.searchButton }
                    onClick={handleSearch}
                    ref={button}
                >
                    <span>검색</span>
                </Button>
            </Form>
            <div className={`${style.speechBubble} ${show ? style.show : ''}`} ref={speechBubble}>
                <div className={style.icon}>!</div> &nbsp; <div>이 입력란을 작성하세요.</div>
            </div>
        </div>
    )
}

export default SearchBarImage;