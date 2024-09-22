import React, {useState, useCallback, useRef, useEffect, forwardRef} from 'react';
import { Button } from 'react-bootstrap';
import styles from '../assets/styles/AdminDropdownMenu.module.css';

const DropdownLikeModal = forwardRef(({ items, activeTab }, ref) => {
    const [selected, setSelected] = useState(items[0]);
    const [show, setShow] = useState(false);
    const buttonRef = useRef(null);
    const modalRef = useRef(null);

    // DropdownLikeModal 컴포넌트가 마운트 될때 activeTab 값이 recipes가 아니라 초기 값인 dashboard가 나와서,
    // activeTabe 확인하는 코드.
    // useEffect(() => {
    //     console.log('DropdownLikeModal mounted, activeTab:', activeTab);
    //     return () => {
    //         console.log('DropdownLikeModal unmounted');
    //     };
    // }, []);

    // 버튼 클릭 시 모달 보이게 하는 코드
    const handleToggle = () => {
        setShow(!show)

        // console.log('buttonRef', buttonRef.current.getBoundingClientRect());
        // console.log('modalRef', modalRef.current.getBoundingClientRect());
    };

    const onSelect = useCallback((item) => {
        setSelected(item);
        ref.current = item === items[0] ? null : item;
        setShow(false);
    }, []);


    // 클릭 할 때 버튼과 드롭박스모달이 아니면 드롭박스모달을 보이지 않게 하는 코드
    // 클릭 할 때도 드롭박스 모달을 버튼 밑에 붙이는 코드를 작성하면서 시작했는데,
    // css 속성에 top의 값을 명시하지 않았더니 기본으로 버튼 밑에 붙어서 주석 처리함.
    // => 가로 view 를 줄였더니 드롭박스 모달이 붙는 모양이 이상해져서 다시 주석 지움.
    const handleClickHtmlBody = useCallback((event) => {
        if (!(modalRef.current?.contains(event.target) || buttonRef.current?.contains(event.target))) {
            setShow(false);
        }

        modalRef.current.style.top = `${buttonRef.current.getBoundingClientRect().bottom}px`;
    }, []);

    // 스크롤 할 떄 드랍박스모달이 버튼 밑에 따라 붙게 하는 코드.
    const handleScrollHtmlBody = useCallback((event) => {
        modalRef.current.style.top = `${buttonRef.current.getBoundingClientRect().bottom}px`;

    }, []);

    useEffect(() => {

        if (activeTab === 'recipes') {
            document.addEventListener('mousedown', handleClickHtmlBody);
            document.addEventListener('scroll', handleScrollHtmlBody);

            return () => {
                document.removeEventListener('mousedown', handleClickHtmlBody);
                document.removeEventListener('scroll', handleScrollHtmlBody);
            };

        }

    }, [activeTab]);

    return (
        <div className={styles.dropdownContainer}>
            <Button
                ref={buttonRef}
                variant="light"
                onClick={handleToggle}
                className={`${styles.dropdownToggle} ${show ? styles.active : ''}`}
            >
                {selected}
                <span className={`${styles.caret} ${show ? styles.caretRotate : ''}`}></span>
            </Button>

            <div
                ref={modalRef}
                className={`${styles.dropdownMenu} ${show ? styles.show : ''}`}
            >
                {items.map((item, index) => (
                    <Button
                        key={index}
                        variant="light"
                        onClick={() => onSelect(item)}
                        className={styles.dropdownItem}
                    >
                        {item}
                    </Button>
                ))}
            </div>
        </div>
    );
});

export default DropdownLikeModal;