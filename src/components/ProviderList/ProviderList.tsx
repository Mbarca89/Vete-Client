import Table from 'react-bootstrap/Table';
import { provider } from '../../types';
import { useState, useEffect } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import CustomModal from '../Modal/CustomModal';
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import { notifyError } from '../Toaster/Toaster';
import EditProvider from '../EditProviders/EditProviders';
import DeleteProvider from '../DeleteProvider/DeleteProvider';
import Spinner from 'react-bootstrap/Spinner';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const ProviderList = () => {
    const [loading, setLoading] = useState(false)

    const [providers, setProviders] = useState<provider[]>([{
        id: "",
        name: "",
        contactName: "",
        phone: ""
    }]);

    const [selectedProvider, setSelectedProvider] = useState<provider>({
        id: "",
        name: "",
        contactName: "",
        phone: ""
    })

    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState("")


    const getProviders = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/providers/getProviders`)
            if (res.data) {
                setProviders(res.data)
            }
            setLoading(false)
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
            setLoading(false)
        }
    }

    const handleEditProvider = (provider: provider) => {
        setSelectedProvider(provider)
        setModal("editProvider")
        setShow(true)
    }

    const handleDeleteProvider = (provider: provider) => {
        setSelectedProvider(provider)
        setModal("deleteProvider")
        setShow(true)
    }

    const updateList = () => {
        getProviders()
    }

    useEffect(() => {
        getProviders()
    }, [])

    return (
        <div className='text-nowrap'>
            {!loading ? <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className=''>Nombre</th>
                        <th>Nombre de contacto</th>
                        <th>Telefono</th>
                        <th>Editar</th>
                        <th className=''>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map(provider => <tr key={String(provider.name)}>
                        <td className=''>{provider.name}</td>
                        <td>{provider.contactName}</td>
                        <td>{provider.phone}</td>
                        <td><svg onClick={() => handleEditProvider(provider)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg></td>
                        <td><svg onClick={() => handleDeleteProvider(provider)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="0" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><g id="evaPersonDeleteOutline0"><g id="evaPersonDeleteOutline1"><path id="evaPersonDeleteOutline2" fill="currentColor" d="m20.47 7.5l.73-.73a1 1 0 0 0-1.47-1.47L19 6l-.73-.73a1 1 0 0 0-1.47 1.5l.73.73l-.73.73a1 1 0 0 0 1.47 1.47L19 9l.73.73a1 1 0 0 0 1.47-1.5ZM10 11a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2Zm0 8a7 7 0 0 0-7 7a1 1 0 0 0 2 0a5 5 0 0 1 10 0a1 1 0 0 0 2 0a7 7 0 0 0-7-7Z" /></g></g></g></svg></svg></td>
                    </tr>

                    )}
                    {show && modal == "editProvider" &&
                        <CustomModal title="Editar proveedor">
                            <EditProvider provider={selectedProvider} updateList={updateList} />
                        </CustomModal>
                    }
                    {show && modal == "deleteProvider" &&
                        <CustomModal title="Eliminar proveedor">
                            <DeleteProvider provider={selectedProvider} updateList={updateList} />
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

export default ProviderList