import Chart from "react-apexcharts";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import type { saleReport } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const MonthlyGraph = () => {
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

    const options: ApexCharts.ApexOptions = {
        chart: {
            id: 'donut',
            type: 'donut'
        },
        legend: {
            position: "bottom"
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true
                    }
                }
            }
        },
        labels: ["Ventas", "Costo", "Pagos"],
        responsive: [
            {
                breakpoint: 992,
                options: {
                    width: "900"
                }
            }
        ]
    };


    return (
        <div className="d-flex flex-column w-100 h-100">
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
            <div className="d-flex w-100 h-100 d-flex justify-content-center mt-5">
                <Chart className=''
                    options={options}
                    series={[sales.totalAmount, sales.totalCost, sales.payments]}
                    type="donut"
                    width={500}
                    style={{width: 600}}
                />
            </div>
        </div>
    )
}

export default MonthlyGraph