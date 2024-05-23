import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import handleError from '../../utils/HandleErrors';
import { useEffect, useState } from 'react';
import { axiosWithToken } from '../../utils/axiosInstances';
import { saleReport } from '../../types';
import { Spinner, Table } from 'react-bootstrap';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface GroupedData {
    [date: string]: {
        amount: number;
        cost: number;
    };
}

interface DataPoint {
    amount: number;
    cost: number;
    date: string;
}

const MonthlyReport = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [sales, setSales] = useState<saleReport>({
        totalAmount: 0,
        totalCost: 0,
        payments: 0
    })
    const currentDate = new Date();
    const [dates, setDate] = useState({
        year: `${currentDate.getFullYear()}`,
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    })

    const getReport = async () => {
        setLoading(true)
        try {
            const startDate = new Date(Number(dates.year), Number(dates.month) - 1, 1)
            const endDate = new Date(Number(dates.year), Number(dates.month), 0)
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/sales/getByMonth?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
            if (res.data) {
                setSales(res.data)
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
        getReport()
    }

    useEffect(()=>{
        getReport()
    },[])

    return (
        <div className='text-nowrap'>
            <div className='mt-5'>
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
            <div className='mt-5'>
                {loading ? <Spinner /> : <Table striped bordered hover size="md">
                    <thead>
                        <tr>
                            <th>Ventas</th>
                            <th className=''>Costo</th>
                            <th>Diferencia</th>
                            <th>Pagos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{`$${new Intl.NumberFormat('es-ES').format(sales.totalAmount)}`}</td>
                            <td>{`$${new Intl.NumberFormat('es-ES').format(sales.totalCost)}`}</td>
                            <td>{`$${new Intl.NumberFormat('es-ES').format(sales.totalAmount - sales.totalCost)}`}</td>
                            <td>{`$${new Intl.NumberFormat('es-ES').format(sales.payments)}`}</td>
                        </tr>
                    </tbody>
                </Table>}
            </div>
        </div>
    )
}

export default MonthlyReport