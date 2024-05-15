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
import { notifyError } from "../Toaster/Toaster";
import handleError from "../../utils/HandleErrors";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const Graphs = () => {

    const [sales, setSales] = useState<sale[]>([])
    const [show, setShow] = useRecoilState(modalState)
    const [currentSale, setCurrentSale] = useState("")

    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        dateEnd: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    })

    const [categories, setCategories] = useState<string[]>([]);
    const [amountData, setAmountData] = useState<number[]>([])
    const [costData, setCostData] = useState<number[]>([])

    const getSales = async () => {
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
        }
    }

    const formatDate = (date: any) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleDates = (event: any) => {
        setDate({
            ...dates,
            [event.target.name]: new Date(event.target.value)
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getSales()
    }

    const handleDetail = (saleId: string) => {
        setCurrentSale(saleId)
        setShow(true)
    }

    const getDaysArray = (startDate: Date, endDate: Date): string[] => {
        const daysArray: string[] = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${month}-${day}`;
            daysArray.push(dateString);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return daysArray;
    }

    const setGraphData = (sales: sale[], startDate: Date, endDate: Date) => {
        const daysArray = getDaysArray(startDate, endDate);
        const amountsByDay: number[] = new Array(daysArray.length).fill(0);
        const costByDay: number[] = new Array(daysArray.length).fill(0);

        for (const sale of sales) {
            const saleDate = new Date(sale.date.split(' ')[0]);
            const timeDiff = saleDate.getTime() - startDate.getTime();
            const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            if (dayDiff >= 0 && dayDiff < amountsByDay.length) {
                amountsByDay[dayDiff] += sale.amount;
                costByDay[dayDiff] += sale.cost;
            }
        }
        setCategories(daysArray)
        setAmountData(amountsByDay)
        setCostData(costByDay)
    }


    useEffect(() => {
        getSales()
    }, [])

    useEffect(() => {
        setGraphData(sales, dates.dateStart, dates.dateEnd)
    }, [sales])

    const options = {
        chart: {
            id: "Line"
        },
        xaxis: {
            categories: categories
        }
    }
    const series = [
        {
            name: "Ventas",
            data: amountData
        },
        {
            name: "Costo",
            data: costData
        }
    ]

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
                            value={formatDate(dates.dateStart)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Form.Control
                            type="date"
                            placeholder="Buscar"
                            name="dateEnd"
                            className=""
                            onChange={handleDates}
                            value={formatDate(dates.dateEnd)}
                        />
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
                    type="line"
                    stroke="smooth"
                    style={{ width: "90%", heigth: "50" }}
                />
            </div>
        </div>
    )
}

export default Graphs