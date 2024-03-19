import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import { userData } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import EditUser from '../../views/EditUser/EditUser';
import CustomModal from '../Modal/CustomModal';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const UserList = () => {

    const [selectedUser, setSelectedUser] = useState<userData>({
        id: "",
        name: "",
        surname: "",
        userName: "",
        password: "",
        role: ""
    });


    const [users, setUsers] = useState<userData[]>([{
        id: "",
        name: "",
        surname: "",
        userName: "",
        password: "",
        role: ""
    }]);

    const [showModal, setShowModal] = useState<boolean>(false)

    useEffect(() => {
        const getUsers = async () => {
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/users/getUsers`)
            if (res.data) {
                setUsers(res.data)
            }
        }
        getUsers()
    }, [])

    const handleEdit = (user: userData) => {
        setSelectedUser(user);
        setShowModal(!showModal);
    };

    return (
        <div className='overflow-auto'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Nombre de usuario</th>
                        <th>Rol</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => <tr key={String(user.userName)}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.surname}</td>
                        <td>{user.userName}</td>
                        <td>{user.role}</td>
                        <td><svg onClick={() => handleEdit(user)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg></td>
                    </tr>

                    )}
                    {showModal && 
                    <CustomModal showModal={showModal} setShowModal={setShowModal}>
                        <EditUser user={selectedUser} />
                    </CustomModal>}
                </tbody>
            </Table>
        </div>
    )
}

export default UserList