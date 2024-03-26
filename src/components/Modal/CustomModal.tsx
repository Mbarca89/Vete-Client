import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"



function CustomModal({ children, title }: any) {

  let [show, setShow] = useRecoilState(modalState)
  
  const handleClose = () => setShow(false);
  
  return (
    <>
      <Modal backdrop="static" show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Guardar
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default CustomModal;