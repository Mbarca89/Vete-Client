import { notifySuccess } from "../Toaster/Toaster";
import { axiosWithToken } from "../../utils/axiosInstances";
import { confirmModalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface ConfirmPetProfileShareProps {
    publicId: string;
    petName: string;
    phoneNumber: string;
}

const ConfirmPetProfileShare: React.FC<ConfirmPetProfileShareProps> = ({ publicId, petName, phoneNumber }) => {
    const [loading, setloading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(confirmModalState)

    console.log(publicId)

    const handleShare = async () => {
        setloading(true)
        try {
            const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/public/pet/send?publicId=${publicId}`)
            if (res.data) {
                notifySuccess(res.data)
                setShow(false)
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setloading(false)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <span>Se va a compartir el perfil público de {petName} al teléfono {phoneNumber}</span>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                <div className="w-25 d-flex align-items-center justify-content-center">
                    <Button className="" variant="danger" onClick={handleCancel}>No</Button>
                </div>
                {!loading ?
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="primary" onClick={handleShare}>Si</Button>
                    </div>
                    :
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
                }
            </div>
        </div>
    )
}

export default ConfirmPetProfileShare