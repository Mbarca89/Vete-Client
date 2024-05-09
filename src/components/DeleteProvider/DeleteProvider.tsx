import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { provider } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeleteProviderProps {
    provider: provider;
    updateList: () => void;
}

const DeleteProvider: React.FC<DeleteProviderProps> = ({ provider, updateList }) => {

    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/providers/delete?providerId=${provider.id}`)
            if(res.data) {
                notifySuccess(res.data)
                updateList()
                setShow(false)
            }
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
            <div className="mt-3 ">
                <Button className="m-3" variant="danger" onClick={handleDelete}>Si</Button>
                <Button className="m-3" variant="primary" onClick={handleCancel}>No</Button>
            </div>
        </div>
    )
}

export default DeleteProvider