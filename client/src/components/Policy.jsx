import React from 'react';
import { Accordion } from 'react-bootstrap';
import styles from '../assets/styles/Policy.module.css';

const Policy = () => {
  return (
    <div className={styles.policyContainer}>
      <Accordion className={styles.accordion}>
        <Accordion.Item eventKey="0" className={styles.accordionItem}>
          <Accordion.Header className={styles.accordionHeader}>이용약관</Accordion.Header>
          <Accordion.Body className={styles.accordionBody}>
            <h5 className={styles.policySubtitle}>제 1 조 (목적)</h5>
            <p className={styles.policyText}>이 약관은 우리 서비스가 제공하는 온라인 서비스(이하 "서비스"라 합니다)의 이용조건 및 절차, 회원과 당사의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            
            <h5 className={styles.policySubtitle}>제 2 조 (약관의 효력과 변경)</h5>
            <p className={styles.policyText}>1. 당사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.<br/>
            2. 당사는 약관의 규제에 관한 법률 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
            
            {/* 추가 약관 내용... */}
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className={styles.accordionItem}>
          <Accordion.Header className={styles.accordionHeader}>개인정보 수집 및 이용 동의</Accordion.Header>
          <Accordion.Body className={styles.accordionBody}>
            <h5 className={styles.policySubtitle}>1. 개인정보의 수집 및 이용 목적</h5>
            <p className={styles.policyText}>회원 관리, 서비스 제공 및 개선, 신규 서비스 개발 등</p>
            
            <h5 className={styles.policySubtitle}>2. 수집하는 개인정보의 항목</h5>
            <p className={styles.policyText}>아이디, 비밀번호, 이름, 이메일 주소, 휴대폰 번호 등</p>
            
            <h5 className={styles.policySubtitle}>3. 개인정보의 보유 및 이용 기간</h5>
            <p className={styles.policyText}>회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보존)</p>
            
            {/* 추가 개인정보 처리방침 내용... */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Policy;