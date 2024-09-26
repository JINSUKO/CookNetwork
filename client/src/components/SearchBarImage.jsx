/* SearchBarImage.jsx
사용자에게 이미지 파일를 입력받아 검색 기능을 수행합니다.
메인 상단 검색창, 버튼은 부트스트랩을 사용하였습니다.
*/

import React, {useEffect, useRef, useState} from "react";
import {Button, Form} from "react-bootstrap";

import style from "../assets/styles/SearchBarImage.module.css";
import {useNavigate} from "react-router-dom";

const SearchBarImage = ( {onSearch} ) => {

    const AI_HOST_IP = import.meta.env.VITE_AI_HOST_IP;

    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("이미지 파일 선택");

    const fileInput = useRef(null);
    const fileInputDisplay = useRef(null);
    const speechBubble = useRef(null);
    const button = useRef(null);

    const fileInputClick = () => {
        fileInput.current.click();
    };

    const fileInputChange = (e) => {

        const file = e.target.files[0];

        if (!file) { return setFileName("이미지 파일 선택"); }

        if (!file.type.startsWith('image/')) return alert('이미지 파일만 선택해주세요.');

        setFile(file);
        setFileName(file.name);
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!file) {

            setShow(true);

            updateModalPosition()

            fileInputDisplay.current.style.borderColor = '#86b7fe';
            fileInputDisplay.current.style.border= '1px solid #ccc';
            fileInputDisplay.current.style.boxShadow = '0 0 0 .25rem rgba(13, 110, 253, .25)';
            fileInputDisplay.current.style.transform = 'scale(1)';
            return
        }

        console.log(file)

        const formData = new FormData();
        formData.append('image', file);

        fileInput.current.value = null;

        setTimeout(() => {
            alert('이미지 분류 중입니다. 잠시만 기다려 주세요.');
        }, 1);

        let data = null;
        try {
            const response = await fetch(`${AI_HOST_IP}/ai/recipeImage/search`, {
                method: 'Post',
                body: formData
            });

            data = await response.json();
            console.log(data);

            if (!response.ok) {return alert('에러가 발생했습니다. 관리자에게 문의해주세요.');}
        } catch (e) {
            console.error(e);
            return alert('에러가 발생했습니다. 관리자에게 문의해주세요.');
        }

        try {
            navigate(`/search?q=${encodeURIComponent(data.result)}`);

            if (onSearch) {
              onSearch(`/search?q=${encodeURIComponent(data.result)}`);
            }
        } catch (e) {
            console.error(e);
        }

    }

    const updateModalPosition = () => {
        if (fileInputDisplay.current && speechBubble.current) {
            const rect = fileInputDisplay.current.getBoundingClientRect();
            speechBubble.current.style.top = `${rect.bottom + 10}px`;
            speechBubble.current.style.left = `${rect.left - 20}px`;
        }
    };

    const handleResize = () => {
        requestAnimationFrame(updateModalPosition);
    };

    const handleClickHtmlBody = (event) => {
        event.preventDefault()

        if (fileInputDisplay.current) {

            if (button.current?.contains(event.target)) return;

            console.log(21321)
            setShow(false);

            fileInputDisplay.current.style.borderColor = '#cccccc';
            fileInputDisplay.current.style.boxShadow = 'none';
        }
    }

    const handleScrollHtmlBody = (event) => {
        updateModalPosition()
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

    }, [file]);

    useEffect(() => {

        return () => {
            // fileInput.current = null;
            fileInputDisplay.current = null;
            speechBubble.current = null;
            button.current = null;
            setFile(null);
            setFileName("이미지 파일 선택");
        }
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
                <label className={`${style.customFileLabel} form-control`} onClick={fileInputClick} ref={fileInputDisplay}>
                    {fileName}
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

export default React.memo(SearchBarImage);