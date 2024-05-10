import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { client } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeleteClientProps {
    client: client;
    onUpdateClient: () => void;
}

const DeleteClient: React.FC<DeleteClientProps> = ({ client, onUpdateClient }) => {

    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/clients/delete?id=${client.id}`)
            if (res.data) {
                notifySuccess(res.data)
                onUpdateClient()
                setShow(false)
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <span>¿Esta seguro que quiere eliminar el cliente "{client.name}?</span>
            <div className="mt-3 ">
                <Button className="m-3" variant="danger" onClick={handleDelete}>Si</Button>
                <Button className="m-3" variant="primary" onClick={handleCancel}>No</Button>
            </div>
        </div>
    )
}

export default DeleteClient