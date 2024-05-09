import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { provider } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import { Spinner } from "react-bootstrap";
import { useState } from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeleteProviderProps {
    provider: provider;
    updateList: () => void;
}

const DeleteProvider: React.FC<DeleteProviderProps> = ({ provider, updateList }) => {
    const [loading, setloading] = useState(false)
    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        setloading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/providers/delete?providerId=${provider.id}`)
            if(res.data) {
                notifySuccess(res.data)
                updateList()
                setShow(false)
            }
            setloading(false)
        } catch (error:any) {
            notifyError(error.response.data)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <span>¿Esta seguro que quiere eliminar el proveedor "{provider.name}?</span>
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

export default DeleteProvider