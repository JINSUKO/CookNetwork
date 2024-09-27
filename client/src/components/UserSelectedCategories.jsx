import {Button, Col, Container, Row} from "react-bootstrap";
import React, {useEffect, useRef} from "react";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import styles from "../assets/styles/RecipeCard.module.css";
import BookmarkButton from "./Bookmark/BookmarkButton.jsx";
import {FaClock, FaRegChartBar} from "react-icons/fa";

const UserSelectedCategories = ({categories, userCategoryRecipes}) => {

    const parentUserCategoryDiv = useRef('');

    // 둘 다 초기 값인 null 인 경우 밑의 코드를 실행시키지 않는다.
    if (!categories || !userCategoryRecipes) {return }

    const handleCardclick = (e, recipe_id) => {
        // 북마크 버튼 클릭 시 카드가 클릭되어 상세페이지로 이동되는 것을 방지
        if (e.target.closest(`.${styles.bookmarkWrapper}`)){
            e.preventDefault();
            e.stopPropagation();
        } else {
            // 카드의 다른 부분 클릭시 레시피 상세 페이지로 이동
            window.location.href = `/recipe/${recipe_id}`;
        }
    };

    return (
        <>
            <h6 className="mb-3">카테고리 최신 레시피</h6>
            {categories.map((category, idx) => (
                <Button key={idx} variant="outline-success" size="sm"
                        className="me-2 mb-2 ">{category}</Button>
            ))}
            <Row xs={2} md={3} lg={4} className="g-2 mb-4">
                {userCategoryRecipes.map((recipe) => (
                    <Col key={recipe.recipe_id}>
                        <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
                          <Card
                            className={styles.recipeCard}
                            onClick={(e) => handleCardclick(e, recipe.recipe_id)}
                            >
                          <div className={styles.imageWrapper}>
                            {recipe.recipe_img ? (
                            <Card.Img variant="top" src={recipe.recipe_img}  className={styles.recipeImage}/>
                            ) : (
                              <div style={{height: '200px' }}></div>
                            )}
                                <div className={styles.bookmarkWrapper}>
                                    <BookmarkButton recipe_id={recipe.recipe_id} />
                                </div>
                          </div>
                          <Card.Body>
                            <Card.Title className={styles.recipeMyPageTitle}>
                              {recipe.recipe_name}
                            </Card.Title>
                            <Card.Title  className={styles.recipeMyPageDesc}>
                              {recipe.recipe_desc}
                            </Card.Title>
                            <div className={styles.recipeInfo}>
                              <span style={{ marginRight: '16px'}}>
                                <FaRegChartBar className={styles.icon} />
                                레벨{recipe.level}
                              </span>
                              <span>
                                <FaClock className={styles.icon} />
                                {recipe.cooked_time}분
                              </span>
                            </div>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                ))}
            </Row>
        </>
    )

};


export default UserSelectedCategories;
