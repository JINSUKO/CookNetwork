import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from "../assets/styles/RecipeCard.module.css";
import { FaClock, FaRegChartBar } from "react-icons/fa";

const UserMyRecipe = ({ recipes }) => {
    const handleCardClick = (e, recipe_id) => {
        if (e.target.closest(`.${styles.bookmarkWrapper}`)) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <Row xs={2} md={3} lg={4} className="g-2 mb-4">
            {recipes && recipes.map((recipe) => (
                <Col key={recipe.recipe_id}>
                    <Link to={`/recipe/${recipe.recipe_id}`} style={{ textDecoration: 'none' }}>
                        <Card
                            className={styles.recipeCard}
                            onClick={(e) => handleCardClick(e, recipe.recipe_id)}
                        >
                            <div className={styles.imageWrapper}>
                                {recipe.recipe_img ? (
                                    <Card.Img variant="top" src={recipe.recipe_img} className={styles.recipeImage}/>
                                ) : (
                                    <div style={{height: '200px' }}></div>
                                )}
                                <div className={styles.bookmarkWrapper}>
                                    {/* Bookmark button can be added here if needed */}
                                </div>
                            </div>
                            <Card.Body>
                                <Card.Title className={styles.recipeMyPageTitle}>
                                    {recipe.recipe_name}
                                </Card.Title>
                                <Card.Title className={styles.recipeMyPageDesc}>
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
    );
};

export default UserMyRecipe;