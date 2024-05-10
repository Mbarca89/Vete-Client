import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';
import 'bootstrap-icons/font/bootstrap-icons.css'
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { useEffect, useState } from 'react'
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import CustomModal from '../Modal/CustomModal';
import CreateVaccine from '../CreateVaccine/CreateVaccine';
import { axiosWithToken } from '../../utils/axiosInstances';
import { events } from '../../types';
import { notifyError } from '../Toaster/Toaster';
import VaccineDetail from '../VaccineDetail/VaccineDetail';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface VaccinesProps {
    petId: string;
}

const Vaccines: React.FC<VaccinesProps> = ({ petId }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")
    const [currentEvent, setCurrentEvent] = useState({

    })

    const [events, setEvents] = useState<events[]>([])

    const getVaccines = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/vaccines/getVaccines/${petId}`)
            if (res.data) {
                setEvents(res.data.map((event: any) => ({
                    title: event.name,
                    notes: event.notes,
                    start: event.date,
                    allDay: false,
                    backgroundColor: event.name == "Vacuna" ? 'blue' : 'red'
                })))
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error.message == "Network Error" ? "Error de comunicacion con el servidor" : error.message)
        }
    }

    const handleCreateVaccine = () => {
        setShow(true)
        setModal("create")
    }

    const handleEventDetail = (info: any) => {
        setCurrentEvent(info.event)
        setShow(true)
        setModal("detail")
    }

    useEffect(() => {
        getVaccines()
    }, [])

    return (
        <div className=''>
            <div className='d-flex flex-column align-items-start'>
                <h6 role="button" onClick={handleCreateVaccine}>Agregar evento<svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></h6>
            </div>
            <FullCalendar
                plugins={[bootstrap5Plugin, listPlugin]}
                initialView="listYear"
                themeSystem='bootstrap5'
                locale="esLocale"
                buttonText={{ today: "hoy" }}
                events={events}
                height={"50vh"}
                displayEventTime={false}
                eventClick={(info: any) => handleEventDetail(info)}
            />
            {show && modal == "create" &&
                <CustomModal title={"Agregar evento"}>
                    <CreateVaccine petId={petId} updateList={getVaccines} />
                </CustomModal>}
            {show && modal == "detail" &&
                <CustomModal title={"Detalles"}>
                    <VaccineDetail event={currentEvent} />
                </CustomModal>}
        </div>
    )
}

export default Vaccines