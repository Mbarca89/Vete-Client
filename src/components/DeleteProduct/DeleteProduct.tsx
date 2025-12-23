import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { userData } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeleteProductProps {
    productId: number;
    onUpdateProduct: () => void;
    setModal: (modal: string) => void;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ productId, onUpdateProduct, setModal }) => {
    const [loading, setloading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        setloading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/products/delete?productId=${productId}`)
            if (res.data) {
                notifySuccess(res.data)
                onUpdateProduct()
                setModal("")
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setloading(false)
        }
    }

    const handleCancel = () => {
        setModal("")
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <span>¿Esta seguro que quiere eliminar el producto?</span>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                {!loading ?
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="danger" onClick={handleDelete}>Si</Button>
                    </div>
                    :
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
                }
                <div className="w-25 d-flex align-items-center justify-content-center">
                    <Button className="" variant="primary" onClick={handleCancel}>No</Button>
                </div>
            </div>
        </div>
    )
}

export default DeleteProduct