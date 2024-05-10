import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { pet } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useState } from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeletePetProps {
    currentPet: pet
    updateList: () => void;
}

const DeletePet: React.FC<DeletePetProps> = ({ currentPet, updateList }) => {
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/pets/delete?petId=${currentPet.id}`)
            if (res.data) {
                notifySuccess(res.data)
                updateList()
                setShow(false)
            }
            setLoading(false)
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <span>¿Esta seguro que quiere eliminar la mascota "{currentPet.name}?</span>
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

export default DeletePet