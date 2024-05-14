import { axiosWithToken } from "../../utils/axiosInstances";
import { useEffect, useState } from "react";
import { order } from "../../types";
import { notifyError } from "../Toaster/Toaster";
import Table from 'react-bootstrap/Table';
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface OrderDetailProps {
    orderId: string
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId }) => {

    const [order, setOrder] = useState<order>()

    const getSale = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/orders/getById/${orderId}`)
            if (res.data) {
                setOrder(res.data)
            }
        } catch (error: any) {
            handleError(error)
        }
    }

    useEffect(() => {
        getSale()
    }, [])

    return (
        order && <div className="text-nowrap overflow-auto flex-grow-1">
            <div>
                <p><b>Fecha: </b>{order.date.split(" ")[0]}</p>
                <p><b>Hora: </b>{order.date.split(" ")[1]}</p>
                <p><b>Productos: </b></p>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.orderProducts.map(product => <tr key={String(product.productId)}>
                        <td>{product.productName}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.productCost}</td>
                        <td>{product.quantity}</td>
                        <td>{(product.quantity * product.productCost).toFixed(2)}</td>
                    </tr>
                    )}
                </tbody>
            </Table>
            <div className="d-flex justify-content-end">
                <p><b>Total: </b>${order.amount.toFixed(2)}</p>
            </div>
        </div>
    )
}

export default OrderDetail