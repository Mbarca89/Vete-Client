import { useEffect, useState } from "react"
import { Spinner } from "react-bootstrap"
import io from "socket.io-client";
import { notifyError, notifySuccess } from "../../components/Toaster/Toaster";
import Table from 'react-bootstrap/Table';
import { message } from "../../types";
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { axiosWithToken } from "../../utils/axiosInstances";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const WASERVER_URL = import.meta.env.VITE_REACT_APP_WASERVER_URL;

const Wa = () => {

    const [qrCode, setQrCode] = useState("")
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true)
    const [loadingQr, setLoadingQr] = useState<boolean>(true)
    const [ready, setReady] = useState<boolean>(false)
    const [server, setServer] = useState<boolean>(false)
    const [messages, setMessages] = useState<message[]>([])

    const getMessages = async (day: string) => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/messages/getMessages?date=${day}`)
            if (res && res.data) {
                setMessages(res.data)
            }
            setLoadingMessages(false)
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
        }
    }

    useEffect(() => {
        try {
            const socket = io(WASERVER_URL);

            socket.on('connect_error', (error) => {
                setServer(false);
                setReady(false)
                setQrCode("")
                notifyError("Error al conectarse al servidor");
            });

            socket.on('serverReady', () => {
                try {
                    setServer(true);
                } catch (error) {
                    setServer(false)
                }
            });

            socket.on('ready', (message: string) => {
                setReady(true);
                setLoading(false)
                setLoadingQr(false)
                notifySuccess(message)
            });

            socket.on('logedOut', (message: string) => {
                setReady(false);
                notifySuccess(message)
            });

            socket.on('qr', (dataURL) => {
                setQrCode(dataURL);
                setLoadingQr(false)
            });
            return () => {
                socket.disconnect();
            };
        } catch (error: any) {
            setServer(false)
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
        }
    }, []);

    const handleDateChange = (dateInfo: any) => {
        getMessages(dateInfo.start.toISOString())
    }

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
            <div className="d-flex justify-content-around gap-4">
                <div className="d-flex align-items-center">
                    <h6 className="m-auto">Estado del servidor: </h6>
                    {server ?
                        <svg width="50" height="50" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 16 16" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.75 8.75l3.5 3.5l7-7.5" /></g></svg></svg> :
                        <svg width="50" height="50" viewBox="0 0 512 512" style={{ color: "#E8403E" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#E8403E" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M17 17L7 7m10 0L7 17" /></g></svg></svg>
                    }
                </div>
                <div className="d-flex align-items-center">
                    <h6 className="m-auto">Estado de whatsapp: </h6>
                    {ready ?
                        <svg width="50" height="50" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 16 16" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.75 8.75l3.5 3.5l7-7.5" /></g></svg></svg> :
                        <svg width="50" height="50" viewBox="0 0 512 512" style={{ color: "#E8403E" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#E8403E" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M17 17L7 7m10 0L7 17" /></g></svg></svg>
                    }
                </div>
            </div>
            {loadingQr ? <Spinner /> : !ready && qrCode && <div className="mt-5">
                <h4>Escanee el codigo con su aplicación de whatsapp: </h4>
                <div><img src={qrCode} alt="QR Code" /></div>
            </div>}
            {ready && <div className='text-nowrap mt-3'>
                <h4>Mensajes enviados: </h4>
                <div className="custom-calendar mt-3">
                    <FullCalendar
                        plugins={[bootstrap5Plugin, listPlugin]}
                        initialView="listDay"
                        themeSystem='bootstrap5'
                        locale="esLocale"
                        buttonText={{ today: "hoy" }}
                        height={"0%"}
                        displayEventTime={false}
                        datesSet={(dateInfo) => handleDateChange(dateInfo)}
                    />
                </div>
                
                {loadingMessages ?
                    <Spinner className="mt-5" />
                    : <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Mascota</th>
                                <th>Motivo</th>
                                <th>Enviado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(message => <tr key={String(message.clientName)}>
                                <td>{message.clientName}</td>
                                <td>{message.clientPhone}</td>
                                <td>{message.petName}</td>
                                <td>{message.vaccineName}</td>
                                <td>{message.sent ?
                                    <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 16 16" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.75 8.75l3.5 3.5l7-7.5" /></g></svg></svg> :
                                    <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#E8403E" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#E8403E" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M17 17L7 7m10 0L7 17" /></g></svg></svg>
                                }</td>
                            </tr>
                            )}
                        </tbody>
                    </Table>}
            </div>}
        </div>
    )
}

export default Wa