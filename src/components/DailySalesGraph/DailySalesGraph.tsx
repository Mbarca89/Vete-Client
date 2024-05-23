import Chart from "react-apexcharts";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import { sale } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError } from "../../components/Toaster/Toaster";
import handleError from "../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
import { ApexOptions } from 'apexcharts';
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

const DailySalesGraph = () => {
    
    const [sales, setSales] = useState<sale[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })

    const [categories, setCategories] = useState<string[]>([]);
    const [amountData, setAmountData] = useState<number[]>([])
    const [costData, setCostData] = useState<number[]>([])

    const getSales = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(dates.dateEnd);
            endDate.setHours(23, 59, 59, 999);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken(`${SERVER_URL}/api/v1/sales/getByDate?dateStart=${formattedStartDate}&dateEnd=${formattedEndDate}`)
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
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getSales()
    }

    const setGraphData = (sales: sale[], startDate: Date, endDate: Date) => {
        const processData = (sales: sale[]) => {
            const groupedData: GroupedData = sales.reduce((acc: GroupedData, curr: DataPoint) => {
                const dateParts = curr.date.split(' ')[0].split('-');
                const monthDay = `${dateParts[1]}-${dateParts[2]}`;
                if (!acc[monthDay]) {
                    acc[monthDay] = { amount: 0, cost: 0 };
                }
                acc[monthDay].amount += curr.amount;
                acc[monthDay].cost += curr.cost;
                return acc;
            }, {});

            const dates = Object.keys(groupedData);
            const amounts = dates.map(date => groupedData[date].amount);
            const costs = dates.map(date => groupedData[date].cost);

            return { dates, amounts, costs };
        };
        const { dates, amounts, costs } = processData(sales);
        setCategories(dates)
        setAmountData(amounts)
        setCostData(costs)
    }


    useEffect(() => {
        getSales()
    }, [])

    useEffect(() => {
        setGraphData(sales, new Date(dates.dateStart), new Date(dates.dateEnd))
    }, [sales])

    const options: ApexOptions = {
        chart: {
            id: "Line",
            type: "line",
        },
        stroke: {
            curve: 'smooth',
          },
        xaxis: {
            categories: categories
        },
        series: [
            {
                name: "Ventas",
                data: amountData
            },
            {
                name: "Costo",
                data: costData
            }
        ]
    }
    

    return (
        <div className="">
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
                        {loading ? <Spinner/> : <Button type="submit">Buscar</Button>}
                    </Col>
                </Row>
            </Form>
            <div className="d-flex justify-content-center">
                <Chart
                    options={options}
                    series={options.series as any}
                    style={{ width: "90%", heigth: "50" }}
                />
            </div>
        </div>
    )
}

export default DailySalesGraph