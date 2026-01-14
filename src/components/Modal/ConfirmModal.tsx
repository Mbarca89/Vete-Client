import Modal from 'react-bootstrap/Modal';
import { confirmModalState } from "../../app/store"
import { useRecoilState } from "recoil"



function ConfirmModal({ children, title, fullscreen }: any) {

  let [show, setShow] = useRecoilState(confirmModalState);
  
  const handleClose = () => setShow(false);
  
  return (
    <>
      <Modal backdrop="static" show={show} onHide={handleClose} size={fullscreen ? "xl" : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ConfirmModal;