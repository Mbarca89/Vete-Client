import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { userData } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';

const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeleteUserProps {
    user: userData;
    onUpdateUser: () => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ user, onUpdateUser }) => {

    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/v1/users/delete/${user.userName}`)
            if(res.data) {
                notifySuccess(res.data)
                onUpdateUser()
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
            <span>¿Esta seguro que quiere eliminar el usuario "{user.userName}?</span>
            <div className="mt-3 ">
                <Button className="m-3" variant="danger" onClick={handleDelete}>Si</Button>
                <Button className="m-3" variant="primary" onClick={handleCancel}>No</Button>
            </div>
        </div>
    )
}

export default DeleteUser