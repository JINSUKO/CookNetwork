import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

function UserPage() {

    return (
        <Container>
            <Row>
                <Col xs={3} style={{border:"1px solid black", textAlign:'center'}}>
                    <Image src="..\\..\\..\\..\\public\\vite.svg" roundedCircle style={{border:"1px solid black"}} width='100px'/>
                    <p></p>
                </Col>
            </Row>
        </Container>
    );
}

export default UserPage;