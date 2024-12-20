import Chart from "react-apexcharts";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import type { saleReport } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import handleError from "../../utils/HandleErrors";
import { ApexOptions } from 'apexcharts';
import { Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface Sale {
    saleDate: string;
    saleAmount: number;
    saleCost: number;
}

interface Order {
    orderDate: string;
    orderAmount: number;
}

interface Bill {
    billDate: string;
    totalAmount: number;
}

interface Payment {
    paymentDate: string;
    amount: number;
}

interface CombinedReport {
    sales: Sale[];
    orders: Order[];
    bills: Bill[];
    payments: Payment[];
}

interface DailyData {
    sales: number;
    cost: number;
    orders: number;
    bills: number;
    payments: number;
}

interface ChartData {
    categories: string[];
    salesData: number[];
    costData: number[];
    ordersData: number[];
    billsData: number[];
    paymentsData: number[];
}

interface SimplifiedData {
    totalBillAmount: number
    totalOrderAmount: number
    totalPaymentAmount: number
    totalSaleAmount: number
    totalSaleCost: number
}

const SimplifiedReport = () => {

    const [combinedData, setCombinedData] = useState<SimplifiedData>({
        totalBillAmount: 0,
        totalOrderAmount: 0,
        totalPaymentAmount: 0,
        totalSaleAmount: 0,
        totalSaleCost: 0
    });

    const [loading, setLoading] = useState<boolean>(false);

    const currentDate = new Date();
    const [dates, setDate] = useState({
        year: `${currentDate.getFullYear()}`,
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    })

    const getCombinedData = async () => {
        setLoading(true);
        try {
            const startDate = new Date(Number(dates.year), Number(dates.month) - 1, 1)
            const endDate = new Date(Number(dates.year), Number(dates.month), 0)
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken(
                `${SERVER_URL}/api/v1/sales/getSimplifiedReport?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`
            );
            if (res.data) {
                console.log(res.data)
                setCombinedData(res.data);
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDates = (event: any) => {
        setDate({
            ...dates,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        getCombinedData();
    };


    useEffect(() => {
        getCombinedData();
    }, []);

    const options: ApexOptions = {
        chart: {
            id: "SimplifiedReport",
            type: "bar",
        },
        plotOptions: {
            bar: {
                horizontal: false, // Puedes hacer barras horizontales si es necesario
                columnWidth: '45%',  // Ajusta el ancho de las barras
            }
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
        },
        tooltip: {
            y: {
                formatter: (value: number) => `$${value.toFixed(2)}` // Formatear como moneda
            },
        },
        yaxis: {
            labels: {
                formatter: (value: number) => `$${value.toFixed(2)}`, // Formato de moneda en el eje Y
            }
        },
        xaxis: {
            type: "category"
        },
        labels: ["Ventas", "Costo", "Compras", "Pagos", "Facturación"]
    };

    const series = [{
        name:"Monto",
        data: [
            {
                x: "Ventas",
                y: combinedData.totalSaleAmount,
                fillColor: '#00e396',
            },
            {
                x: "Costo",
                y: combinedData.totalSaleCost,
                fillColor: '#ff4560',
            },
            {
                x: "Compras",
                y: combinedData.totalOrderAmount,
                fillColor: '#feb019',
            },
            {
                x: "Pagos",
                y: combinedData.totalPaymentAmount,
                fillColor: '#775dd0',
            },
            {
                x: "Facturación",
                y: combinedData.totalBillAmount,
                fillColor: '#EB8C87',
            },
        ]
    }]

    return (
        <div>
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
            <div className="d-flex justify-content-center">
                <Chart
                    options={options}
                    type="bar"
                    series={series}
                    style={{ width: "90%", height: "50" }}
                />
            </div>
        </div>
    );
};

export default SimplifiedReport;