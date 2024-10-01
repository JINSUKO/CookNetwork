import {Button, Modal} from "react-bootstrap";

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
        return (
            <Modal show={show} onHide={onCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onConfirm}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

export default ConfirmModal;