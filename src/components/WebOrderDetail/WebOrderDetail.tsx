import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import type { webOrder, webOrderItem } from '../../types';
import { axiosWithToken } from '../../utils/axiosInstances';
import handleError from '../../utils/HandleErrors';
import { Row, Spinner, Form, Col, Table, Button } from 'react-bootstrap';
import { notifySuccess } from '../Toaster/Toaster';
import { useRecoilState } from 'recoil';
import ConfirmModal from '../Modal/ConfirmModal';
import { confirmModalState } from '../../app/store';
import ShipWebOrder from '../ShipWebOrder/ShipWebOrder';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface WebOrderDetailProps {
    orderId: number;
    updateList: () => void;
}

const WebOrderDetail: React.FC<WebOrderDetailProps> = ({ orderId, updateList }) => {

    const [loading, setLoading] = useState<boolean>(true)
    const [order, setOrder] = useState<webOrder | null>(null)
    const [show, setShow] = useRecoilState(confirmModalState)

    const getOrder = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/webOrder/getOrderById?orderId=${orderId}`)
            if (res.data) {
                setOrder(res.data)
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleShip = async () => {
        setShow(true)
    }

    useEffect(() => {
        getOrder()
    }, [orderId])

    return (
        !loading && order ? <div>
            <Formik
                initialValues={{
                    id: order.id || 0,
                    customerName: order.customerName || '',
                    customerEmail: order.customerEmail || '',
                    customerPhone: order.customerPhone || '',
                    totalAmount: order.totalAmount || 0,
                    status: order.status || '',
                    paymentId: order.paymentId || 0,
                    createdAt: order.createdAt || '',
                    shipped: order.shipped || false
                }}
                onSubmit={() => { }}
            >
                <Form noValidate>
                    <Row className="mb-2">
                        <Form.Group as={Col}>
                            <Form.Label>Nombre del cliente</Form.Label>
                            <Form.Control type="text"
                                value={order.customerName}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-2">
                        <Form.Group as={Col}>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text"
                                value={order.customerPhone}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Raza"
                                value={order.customerEmail}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-2">
                        <Form.Group as={Col}>
                            <Form.Label>Monto</Form.Label>
                            <Form.Control type="text"
                                value={`$${order.totalAmount.toFixed(2)}`}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Estado del pago</Form.Label>
                            <Form.Control type="text"
                                value={order.status === "APPROVED" ? "Aprobado" : order.status === "PENDING" ? "Pendiente" : "Cancelado"}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                </Form>
            </Formik>
            <h3>Productos</h3>
            <Table striped bordered hover size="md" className="mt-3">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item: webOrderItem, index: number) => (
                        <tr key={index}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{`$${item.unitPrice.toFixed(2)}`}</td>
                            <td>{`$${(item.quantity * item.unitPrice).toFixed(2)}`}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {!order.shipped ? <div className="d-flex flex-column align-items-center">
                    {order.status === "APPROVED" && <span>¿El pedido ya fue enviado o entregado?</span>}
                {order.status === "APPROVED" ? <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                    {!loading ?
                        <div className="w-25 d-flex align-items-center justify-content-center">
                            <Button className="" variant="primary" onClick={handleShip}>Confirmar</Button>
                        </div>
                        :
                        <div className="w-25 d-flex align-items-center justify-content-center">
                            <Spinner />
                        </div>
                    }
                </div> :
                    <div className="d-flex flex-column align-items-center">
                        <span>El pedido esta cancelado <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#E8403E" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#E8403E" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M17 17L7 7m10 0L7 17" /></g></svg></svg></span>
                    </div>
                }
            </div> :
                <div className="d-flex flex-column align-items-center">
                    <span>Pedido entregado <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 16 16" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.75 8.75l3.5 3.5l7-7.5" /></g></svg></svg></span>
                </div>
            }
            {show && <ConfirmModal>
                <ShipWebOrder orderId={order.id} updateList={updateList}></ShipWebOrder>
            </ConfirmModal>}
        </div>

            : <Spinner />
    );
};

export default WebOrderDetail;