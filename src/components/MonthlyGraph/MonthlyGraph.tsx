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

interface CombinedData {
    date: string;
    salesAmount: number;
    salesCost: number;
    ordersAmount: number;
    billsAmount: number;
    paymentsAmount: number;
}

const MonthlyGraph = () => {
    const [combinedData, setCombinedData] = useState<CombinedReport>({
        sales: [],
        orders: [],
        bills: [],
        payments: []
    });
    const [chartData, setChartData] = useState<ChartData>({
        categories: [],
        salesData: [],
        costData: [],
        ordersData: [],
        billsData: [],
        paymentsData: []
    });
    const [loading, setLoading] = useState<boolean>(false);

    const currentDate = new Date();
    const [dates, setDate] = useState({
        year: `${currentDate.getFullYear()}`,
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    })

    const [categories, setCategories] = useState<string[]>([]);
    const [salesAmounts, setSalesAmounts] = useState<number[]>([]);
    const [salesCosts, setSalesCosts] = useState<number[]>([]);
    const [ordersAmounts, setOrdersAmounts] = useState<number[]>([]);
    const [billsAmounts, setBillsAmounts] = useState<number[]>([]);
    const [paymentsAmounts, setPaymentsAmounts] = useState<number[]>([]);

    const getCombinedData = async () => {
        setLoading(true);
        try {
            const startDate = new Date(Number(dates.year), Number(dates.month) - 1, 1)
            const endDate = new Date(Number(dates.year), Number(dates.month), 0)
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken(
                `${SERVER_URL}/api/v1/sales/getCombinedByMonth?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`
            );
            if (res.data) {
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

    const processData = (data: CombinedReport): void => {
        const sales = data.sales;
        const orders = data.orders;
        const bills = data.bills;
        const payments = data.payments;

        // Utilizamos un objeto para almacenar las sumas por día
        const dailyData: { [key: string]: DailyData } = {};

        // Procesar ventas
        sales.forEach((sale) => {
            const date = sale.saleDate.split('T')[0]; // Obtener solo la fecha (sin la hora)
            if (!dailyData[date]) dailyData[date] = { sales: 0, cost: 0, orders: 0, bills: 0, payments: 0 };
            dailyData[date].sales += sale.saleAmount;
            dailyData[date].cost += sale.saleCost;
        });

        // Procesar órdenes
        orders.forEach((order) => {
            const date = order.orderDate.split('T')[0];
            if (!dailyData[date]) dailyData[date] = { sales: 0, cost: 0, orders: 0, bills: 0, payments: 0 };
            dailyData[date].orders += order.orderAmount;
        });

        // Procesar facturas
        bills.forEach((bill) => {
            const date = bill.billDate.split('T')[0];
            if (!dailyData[date]) dailyData[date] = { sales: 0, cost: 0, orders: 0, bills: 0, payments: 0 };
            dailyData[date].bills += bill.totalAmount;
        });

        // Procesar pagos
        payments.forEach((payment) => {
            const date = payment.paymentDate.split('T')[0];
            if (!dailyData[date]) dailyData[date] = { sales: 0, cost: 0, orders: 0, bills: 0, payments: 0 };
            dailyData[date].payments += payment.amount;
        });

        // Ahora que tenemos los datos procesados, los organizamos para el gráfico
        const categories = Object.keys(dailyData);
        const salesData = categories.map((date) => dailyData[date].sales);
        const costData = categories.map((date) => dailyData[date].cost);
        const ordersData = categories.map((date) => dailyData[date].orders);
        const billsData = categories.map((date) => dailyData[date].bills);
        const paymentsData = categories.map((date) => dailyData[date].payments);

        setChartData({
            categories,
            salesData,
            costData,
            ordersData,
            billsData,
            paymentsData
        });
    };

    useEffect(() => {
        getCombinedData();
    }, []);

    useEffect(() => {
        processData(combinedData);
    }, [combinedData]);

    // const options: ApexOptions = {
    //     chart: {
    //         id: "MonthlyGraph",
    //         type: "bar",
    //     },
    //     stroke: {
    //         curve: "smooth",
    //     },
    //     xaxis: {
    //         categories: chartData.categories,
    //     },
    //     series: [
    //         {
    //             name: "Ventas",
    //             data: chartData.salesData,
    //         },
    //         {
    //             name: "Costo",
    //             data: chartData.costData,
    //         },
    //         {
    //             name: "Compras",
    //             data: chartData.ordersData,
    //         },
    //         {
    //             name: "Facturación",
    //             data: chartData.billsData,
    //         },
    //         {
    //             name: "Pagos",
    //             data: chartData.paymentsData,
    //         },
    //     ],
    // };


    const options: ApexOptions = {
        chart: {
            id: "MonthlyGraph",
            type: "bar",
            stacked: true // Cambiado a 'bar' para un gráfico de barras
        },
        plotOptions: {
            bar: {
                horizontal: false, // Puedes hacer barras horizontales si es necesario
                columnWidth: '45%',  // Ajusta el ancho de las barras
            }
        },
        xaxis: {
            type: "datetime",
            categories: chartData.categories
        },
        legend: {
            position: "top",
            horizontalAlign: "center",
        }
    };

    const series = [
        {
            name: "Facturas",
            data: chartData.billsData
        },
        {
            name: "Ventas",
            data: chartData.salesData
        },
        {
            name: "Costo",
            data: chartData.costData
        },
        {
            name: "Pagos",
            data: chartData.paymentsData
        },
        {
            name: "Compras",
            data: chartData.ordersData
        }
    ]

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
                    series={series}
                    type="bar"
                    style={{ width: "90%", height: "50" }}
                />
            </div>
        </div>
    );
};

export default MonthlyGraph;