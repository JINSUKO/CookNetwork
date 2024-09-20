import {Button, Card, Table} from "react-bootstrap";
import React from "react";

const RecipeTable = ({ recipes }) => {

    return (
            <Card>
                <Card.Header as="h5">Recent Recipes</Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recipes.map((recipe) => (
                            <tr key={recipe.id}>
                                <td>{recipe.title}</td>
                                <td>{recipe.author}</td>
                                <td>{recipe.status}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm">Review</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
    );
};

export default RecipeTable;
