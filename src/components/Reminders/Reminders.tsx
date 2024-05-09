import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useEffect, useState } from 'react';
import { events, reminder } from '../../types';
import { notifyError } from '../../components/Toaster/Toaster';
import { axiosWithToken } from '../../utils/axiosInstances';
import { useRecoilState } from 'recoil';
import { modalState } from '../../app/store';
import CustomModal from '../../components/Modal/CustomModal';
import CreateReminder from '../../components/CreateReminder/CreateReminder';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Reminders = () => {

    const [reminders, setReminders] = useState<reminder[]>([])
    const [show, setShow] = useRecoilState(modalState)

    const getReminders = async (day: string) => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/reminders/getReminders/${day}`)
            if (res.data) {
                setReminders(res.data.map((reminder: reminder) => ({
                    title: reminder.name,
                    start: reminder.date
                })))
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error)

        }
    }

    const handleCreateReminder = async () => {
        setShow(true)
    }

    const handleDateChange = (dateInfo: any) => {
        getReminders(dateInfo.start.toISOString())
    }

    useEffect(() => {
        getReminders(new Date().toISOString())
    }, [])

    return (
        <div className='w-100 w-md-25 h-75 custom rounded z-2 p-1'>
            <div className='d-flex flex-row align-items-center justify-content-between'>
                <h2>Recordatorios</h2>
                <svg role="button" onClick={handleCreateReminder} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#632f6b" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg>
            </div>
            <hr />
            <div className='custom-calendar h-100 w-100 overflow-auto'>
                <FullCalendar
                    plugins={[bootstrap5Plugin, listPlugin]}
                    initialView="listDay"
                    themeSystem='bootstrap5'
                    locale="esLocale"
                    buttonText={{ today: "hoy" }}
                    events={reminders}
                    height={"80%"}
                    displayEventTime={false}
                    datesSet={(dateInfo) => handleDateChange(dateInfo)}
                />
            </div>
            {show &&
                <CustomModal>
                    <CreateReminder updateList={() => getReminders(new Date().toISOString())}></CreateReminder>
                </CustomModal>}
        </div>
    )
}

export default Reminders