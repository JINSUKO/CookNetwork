import {Button, Col, Container, Row} from "react-bootstrap";
import {useEffect, useRef} from "react";
import Card from "react-bootstrap/Card";

const UserSelectedCategories = ({categories, userCategoryRecipes}) => {

    const parentUserCategoryDiv = useRef('');

    // 둘 다 초기 값인 null 인 경우 밑의 코드를 실행시키지 않는다.
    if (!categories || !userCategoryRecipes) {return }


    return (
        <>
            <h6 className="mb-3">카테고리 최신 레시피</h6>
            {categories.map((category, idx) => (
                <Button key={idx} variant="outline-success" size="sm"
                        className="me-2 mb-2 ">{category}</Button>
            ))}
            <Row xs={2} md={3} lg={4} className="g-2 mb-4">
                {userCategoryRecipes.map((recipe, idx) => (
                    <Col key={idx}>
                            <Card style={{ height: '100%', fontSize: '1rem'}}>
                              <Card.Img variant="top" src={recipe.recipe_img} style={{ height: '10rem' }} />
                              <Card.Body style={{padding: '0'}}>
                                <Card.Title style={{fontSize: '1rem'}}>{recipe.recipe_name}</Card.Title>
                              </Card.Body>
                            </Card>
                    </Col>
                ))}
            </Row>
        </>
    )

};


export default UserSelectedCategories;
