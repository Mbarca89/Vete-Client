import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifySuccess } from "../Toaster/Toaster";
import handleError from "../../utils/HandleErrors";
import { Button, Spinner } from "react-bootstrap";

const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface ShipWebOrderProps {
    orderId: number;
    updateList: () => void;
}

const ShipWebOrder: React.FC<ShipWebOrderProps> = ({ orderId, updateList }) => {
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.put(`${SERVER_URL}/api/v1/webOrder/shipOrder?orderId=${orderId}`)
            if (res.data) {
                notifySuccess(res.data)
                updateList()
                setShow(false)
            }
            setLoading(false)
        } catch (error: any) {
            handleError(error)
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <span>¿El pedido ya fue enviado o entregado?</span>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                {!loading ?
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="primary" onClick={handleDelete}>Si</Button>
                    </div>
                    :
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
                }
                <div className="w-25 d-flex align-items-center justify-content-center">
                    <Button className="" variant="danger" onClick={handleCancel}>No</Button>
                </div>
            </div>
        </div>
    )
}

export default ShipWebOrder