import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useState } from 'react';
import type { reminder } from '../../types';
import { axiosWithToken } from '../../utils/axiosInstances';
import { useRecoilState } from 'recoil';
import { modalState } from '../../app/store';
import CustomModal from '../../components/Modal/CustomModal';
import CreateReminder from '../../components/CreateReminder/CreateReminder';
import handleError from '../../utils/HandleErrors';
import VaccineDetail from '../VaccineDetail/VaccineDetail';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Reminders = () => {

    const [reminders, setReminders] = useState<reminder[]>([])
    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("create")
    const [currentEvent, setCurrentEvent] = useState()
    const [currentDay, setCurrentDay] = useState("")

    const getReminders = async (day: string) => {
        try {
            const reminderResponse = await axiosWithToken.get(`${SERVER_URL}/api/v1/reminders/getReminders/${day}`)
            const vaccinesResponse = await axiosWithToken.get(`${SERVER_URL}/api/v1/vaccines/getVaccinesByDate?date=${day}`)
            console.log(vaccinesResponse.data, reminderResponse.data);
            
            if (vaccinesResponse && vaccinesResponse.data) {
                setReminders([...reminderResponse.data.map((reminder: reminder) => ({
                    title: reminder.name,
                    start: reminder.date,
                    id: reminder.id,
                    eventType: "reminder"
                })), ...vaccinesResponse.data.map((reminder: reminder) => ({
                    title: reminder.name,
                    start: reminder.date,
                    id: reminder.id,
                    petId: reminder.petId,
                    eventType: "vaccine",
                    backgroundColor: "red"
                }))])
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    const handleCreateReminder = async () => {
        setModal("create")
        setShow(true)
    }

    const handleDateChange = (dateInfo: any) => {
        getReminders(dateInfo.start.toISOString())
        setCurrentDay(dateInfo.start.toISOString())
    }

    const handleEventDetail = (info: any) => {
        setCurrentEvent(info.event)
        setShow(true)
        setModal("detail")
    }

    return (
        <div className='w-100 w-md-25 h-100 custom rounded z-2 p-1'>
            <div className='d-flex flex-row align-items-center justify-content-between'>
                <h2 className='m-0'>Recordatorios</h2>
                <svg role="button" onClick={handleCreateReminder} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg>
            </div>
            <hr className='m-1' />
            <div className='custom-calendar h-100 h-md-100 w-100'>
                <FullCalendar
                    plugins={[bootstrap5Plugin, listPlugin]}
                    initialView="listDay"
                    themeSystem='bootstrap5'
                    locale="esLocale"
                    buttonText={{ today: "hoy" }}
                    events={reminders}
                    displayEventTime={false}
                    datesSet={(dateInfo) => handleDateChange(dateInfo)}
                    eventClick={(info: any) => handleEventDetail(info)}
                    height={'89%'}
                    contentHeight={'100%'}
                />
            </div>
            {show && modal === "create" &&
                <CustomModal>
                    <CreateReminder updateList={() => getReminders(new Date().toISOString())}></CreateReminder>
                </CustomModal>}
            {show && modal === "detail" &&
                <CustomModal title={"Detalles"}>
                    <VaccineDetail event={currentEvent} updateList={()=>getReminders(currentDay)} petId={currentEvent.petId} />
                </CustomModal>}
        </div>
    )
}

export default Reminders