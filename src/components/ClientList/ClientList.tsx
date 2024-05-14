import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { client } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import EditClient from '../EditClient/EditClient';
import CustomModal from '../Modal/CustomModal';
import { modalState, clientState } from "../../app/store"
import { useRecoilState } from "recoil"
import DeleteClient from '../DeleteClient/DeleteClient';
import { notifyError } from '../Toaster/Toaster';
import { Spinner } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const ClientList = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [selectedClient, setSelectedClient] = useRecoilState(clientState)

    const [clients, setClients] = useState<client[]>([{
        id: "",
        name: "",
        surname: "",
        phone: "",
        email: "",
        social: "",
        userName: ""
    }]);

    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")

    const getClients = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/clients/getClients`)
            if (res.data) {
                setClients(res.data)
            }
            setLoading(false)
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        getClients()
    }, [])

    const handleDetail = (client: client) => {
        setSelectedClient(client);
        navigate(`/clients/detail/${client.id}`)
    };

    const handleEdit = (client: client) => {
        setSelectedClient(client);
        setModal("editClient")
        setShow(!show);
    };

    const handleDelete = (client: client) => {
        setSelectedClient(client);
        setModal("deleteClient")
        setShow(!show);
    };

    const updateClients = () => {
        getClients()
    };

    const handleSearch = async (event: any) => {
        setLoading(true)
        let searchTerm
        event.preventDefault()
        if (event.type == "submit") searchTerm = event.target[0].value
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/clients/getClientsByName?searchTerm=${searchTerm}`)
            if (res.data) {
                setClients(res.data);
            }
            setLoading(false)
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
            setLoading(false)
        }
    }

    const handleResetSearch = (event: any) => {
        if (event.target.value == "") getClients()
    }

    return (
        <div className='text-nowrap'>
                <Navbar className="justify-content-between">
                    <Form onSubmit={handleSearch}>
                        <Row>
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar"
                                    className=" mr-sm-2"
                                    onChange={handleResetSearch}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit">Buscar</Button>
                            </Col>
                        </Row>
                    </Form>
                </Navbar>
            {!loading ? <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Teléfono</th>
                        <th>Detalles</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => <tr key={String(client.name)}>
                        <td>{client.id}</td>
                        <td className=''>{client.name}</td>
                        <td>{client.surname}</td>
                        <td>{client.phone}</td>
                        <td><svg onClick={() => handleDetail(client)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="currentColor" d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1c-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" /></g></svg></svg></td>
                        <td><svg onClick={() => handleEdit(client)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg></td>
                        <td><svg onClick={() => handleDelete(client)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><g id="evaPersonDeleteOutline0"><g id="evaPersonDeleteOutline1"><path id="evaPersonDeleteOutline2" fill="currentColor" d="m20.47 7.5l.73-.73a1 1 0 0 0-1.47-1.47L19 6l-.73-.73a1 1 0 0 0-1.47 1.5l.73.73l-.73.73a1 1 0 0 0 1.47 1.47L19 9l.73.73a1 1 0 0 0 1.47-1.5ZM10 11a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2Zm0 8a7 7 0 0 0-7 7a1 1 0 0 0 2 0a5 5 0 0 1 10 0a1 1 0 0 0 2 0a7 7 0 0 0-7-7Z" /></g></g></g></svg></svg></td>
                    </tr>
                    )}
                    {show && modal == "editClient" &&
                        <CustomModal title="Editar cliente">
                            <EditClient client={selectedClient} onUpdateClient={updateClients} />
                        </CustomModal>
                    }
                    {show && modal == "deleteClient" &&
                        <CustomModal title="Eliminar cliente">
                            <DeleteClient client={selectedClient} onUpdateClient={updateClients} />
                        </CustomModal>
                    }
                </tbody>
            </Table> :
                <div>
                    <Spinner />
                </div>
            }
        </div>
    )
}

export default ClientList