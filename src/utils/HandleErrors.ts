import { notifyError } from "../components/Toaster/Toaster";

const handleError = (error: any): void => {
    if (error.response) {
        notifyError(error.response.data);
    } else {
        notifyError(error.message === "Network Error" ? "Error de comunicación con el servidor" : error.message);
    }
};

export default handleError