import { useEffect, useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import { payments } from "../../types";
import handleError from "../../utils/HandleErrors";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import { Spinner } from "react-bootstrap";
import CustomModal from "../Modal/CustomModal";
import PaymentDetail from "../PaymentDetail/PaymentDetail";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const PaymentsList = () => {
    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)
    const currentDate = new Date();
    const [dates, setDate] = useState({
        year: `${currentDate.getFullYear()}`,
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    })
    const [payments, setPayments] = useState<payments[]>([])
    const [currentPayment, setCurrentPayment] = useState<string>("")

    const getPayments = async () => {
        setLoading(true)
        try {
            const startDate = new Date(Number(dates.year), Number(dates.month) - 1, 1)
            const endDate = new Date(Number(dates.year), Number(dates.month), 0)
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/payments/getByDate?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
            if (res.data) {
                setPayments(res.data)
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDates = (event: any) => {
        setDate({
            ...dates,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getPayments()
    }

    const handleDetail = (saleId: string) => {
        setCurrentPayment(saleId)
        setShow(true)
    }

    useEffect(() => {
        getPayments()
    }, [])

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto text-nowrap'>
            <div className='mt-3'>
                <Form onSubmit={handleSubmit}>
                    <Row className='d-flex flex-lg-row flex-column justify-content-center'>
                        <Col xs={10} lg={4}>
                            <Form.Group className="mb-3" as={Row} xs={12} lg={12}>
                                <Form.Label column>Año</Form.Label>
                                <Col>
                                    <Form.Control
                                        type='number'
                                        id="year"
                                        name="year"
                                        value={dates.year}
                                        onChange={(handleDates)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col xs={10} lg={4}>
                            <Form.Group className="mb-3" as={Row} xs={12}>
                                <Form.Label column >Mes</Form.Label>
                                <Col>
                                    <Form.Select
                                        id="month"
                                        name="month"
                                        onChange={(handleDates)}
                                        value={dates.month}
                                    >
                                        <option value="01">01 - Enero</option>
                                        <option value="02">02 - Febrero</option>
                                        <option value="03">03 - Marzo</option>
                                        <option value="04">04 - Abril</option>
                                        <option value="05">05 - Mayo</option>
                                        <option value="06">06 - Junio</option>
                                        <option value="07">07 - Julio</option>
                                        <option value="08">08 - Agosto</option>
                                        <option value="09">09 - Septiembre</option>
                                        <option value="10">10 - Octubre</option>
                                        <option value="11">11 - Noviembre</option>
                                        <option value="12">12 - Diciembre</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Buscar</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            {loading ? <Spinner /> : <Table striped bordered hover size="md" className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th className=''>Fecha</th>
                        <th>Proveedor/Concepto</th>
                        <th>Monto</th>
                        <th>Pagado</th>
                        <th>Medio de pago</th>
                        <th>Fecha de pago</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => <tr role="button" onClick={() => handleDetail(payment.id)} key={String(payment.id)}>
                        <td>{payment.id}</td>
                        <td>{payment.date}</td>
                        <td>{payment.provider}</td>
                        <td>${payment.amount.toFixed(2)}</td>
                        <td>{payment.payed ?
                            <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 16 16" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.75 8.75l3.5 3.5l7-7.5" /></g></svg></svg> :
                            <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#E8403E" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#E8403E" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#E8403E"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M17 17L7 7m10 0L7 17" /></g></svg></svg>
                        }</td>
                        <td>{payment.paymentMethod}</td>
                        <td>{payment.paymentDate}</td>
                    </tr>

                    )}
                    {show &&
                        <CustomModal title="Detalle de pago">
                            <PaymentDetail paymentId={currentPayment} />
                        </CustomModal>
                    }
                </tbody>
            </Table>}
        </div>
    )
}

export default PaymentsList