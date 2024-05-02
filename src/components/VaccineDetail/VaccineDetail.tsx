import { axiosWithToken } from "../../utils/axiosInstances";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface VaccineDetailProps {
    event: any;
}

const VaccineDetail: React.FC<VaccineDetailProps> = ({ event }) => {

    const date = new Date(event.startStr);

const year = date.getFullYear();
const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
const day = date.getDate();

const newDateString = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

    return (
        <div>
            <h2>Tipo: {event.title}</h2>
            <h2>Fecha: {newDateString}</h2>
            <h2>Notas: {event.extendedProps.notes}</h2>
        </div>
    )
}

export default VaccineDetail