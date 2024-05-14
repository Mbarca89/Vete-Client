import { useEffect, useState } from "react"
import { notifyError } from "../Toaster/Toaster"
import { axiosWithToken } from '../../utils/axiosInstances';
import { stockAlert } from "../../types";
import Table from 'react-bootstrap/Table';
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const StockAlerts = () => {

    const [alerts, setAlerts] = useState<stockAlert[]>([])

    const getAlerts = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/getStockAlerts`)
            if (res.data) {
                setAlerts(res.data)
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    useEffect(() => {
        getAlerts()
    }, [])

    return (
        <div>
            <h2>Alertas de stock</h2>
            <hr />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Stock disponible</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map(alert => <tr key={String(alert.productName)}>
                        <td>{alert.productName}</td>
                        <td>{alert.stock}</td>
                    </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default StockAlerts