import Chart from "react-apexcharts";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { saleByCategoryReport } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const CategorySalesGraph = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })

    const [categories, setCategories] = useState<string[]>([]);
    const [amountData, setAmountData] = useState<number[]>([])

    const getSales = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(dates.dateEnd);
            endDate.setHours(23, 59, 59, 999);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get<saleByCategoryReport[]>(`${SERVER_URL}/api/v1/sales/getByCategory?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
            if (res.data) {
                setCategories(res.data.map(data => data.categoryName))
                setAmountData(res.data.map(data => data.totalAmount))
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
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getSales()
    }

    useEffect(() => {
        getSales()
    }, [])

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
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '22px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                        }
                    }
                }
            }
        },
        labels: categories,
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
                <Row>
                    <Col xs="auto">
                        <Form.Control
                            type="date"
                            placeholder="Buscar"
                            name="dateStart"
                            className=""
                            onChange={handleDates}
                            value={String(dates.dateStart)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Form.Control
                            type="date"
                            placeholder="Buscar"
                            name="dateEnd"
                            className=""
                            onChange={handleDates}
                            value={String(dates.dateEnd)}
                        />
                    </Col>
                    <Col xs="auto">
                        {loading ? <Spinner /> : <Button type="submit">Buscar</Button>}
                    </Col>
                </Row>
            </Form>
            <div className="d-flex w-100 h-100 d-flex justify-content-center mt-5">
                <Chart className=''
                    options={options}
                    series={amountData}
                    type="donut"
                    width={500}
                    style={{width: 600}}
                />
            </div>
        </div>
    )
}

export default CategorySalesGraph