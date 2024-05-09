import './ProductList.css'
import React, { useState, useEffect } from 'react';
import ProductDetail from '../ProductDetail/ProductDetail';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { product } from '../../types';
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifyError, notifySuccess } from "../Toaster/Toaster";
import { modalState } from "../../app/store"
import { useRecoilState } from "recoil"
import CustomModal from '../Modal/CustomModal';
import noImage from '../../assets/noImage.png'
import Spinner from 'react-bootstrap/Spinner';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const ProductList = () => {
    const [loading, setloading] = useState(false)
    const [searching, setSearching] = useState(false)
    const [show, setShow] = useRecoilState(modalState)
    const [products, setProducts] = useState<product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<product>({
        id: 0,
        name: "",
        description: "",
        barCode: 0,
        cost: 0,
        price: 0,
        stock: 0,
        categoryId: 0,
        categoryName: "",
        providerName: "",
        stockAlert: false,
        published: false,
        image: ""
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getCount = async () => {
        try {
            const count = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/getProductCount`)
            if (count.data) {
                setTotalPages(Math.ceil(count.data / pageSize));
            }
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const fetchProducts = async () => {
        setloading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/getProductsPaginated?page=${currentPage}&size=${pageSize}`)
            if (res.data) {
                setProducts(res.data);
            }
        } catch (error: any) {
            if (error.response) notifyError(error.response.data)
            else notifyError(error)
        }
        setloading(false)
    };

    const handleDetail = (product: product) => {
        setSelectedProduct(product)
        setShow(!show)
    }

    const handleSearch = async (event: any) => {
        setloading(true)
        let searchTerm
        event.preventDefault()
        try {
            if (event.type == "submit") searchTerm = event.target[0].value
            else event.target.value ? searchTerm = event.target.value : searchTerm = ""
            let res
            if (searchTerm == "") {
                res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/getProductsPaginated?page=${currentPage}&size=${pageSize}`)
            } else {
                res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/searchProduct?searchTerm=${searchTerm}`)
            }
            if (res.data) {
                setProducts(res.data);
            }
            setloading(false)
        } catch (error: any) {
            notifyError(error.response.data)
        }
    }

    const handleResetSearch = (event: any) => {
        if (event.target.value == "") fetchProducts()
    }

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    useEffect(() => {
        getCount();
    }, []);

    return (
        <div>
            <Container>
                <Navbar className="justify-content-between">
                    <Form onSubmit={handleSearch}>
                        <Row>
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar"
                                    className=" mr-sm-2"
                                    onChange={handleResetSearch}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button type="submit">Buscar</Button>
                            </Col>
                        </Row>
                    </Form>
                </Navbar>
                {!loading ? <Row xs={2} md={3} lg={6} className="g-4">
                    {products.map(product => (
                        <Col key={product.id}>
                            <Card style={{ height: '100%' }} onClick={() => handleDetail(product)}>
                                <Card.Img style={{ height: '150px' }} className='custom-card-img' variant="top" src={product.image ? `data:image/jpeg;base64,${product.image}` : noImage} alt={product.name} />
                                <Card.Body className='d-flex flex-column justify-content-end'>
                                    <Card.Title className=''>{product.name}</Card.Title>
                                    <Card.Text>{product.categoryName}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                    }
                </Row> : <Spinner />}
                <div className='d-flex m-auto justify-content-center'>
                    <Pagination className='mt-5'>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        <Pagination.Item>{1}</Pagination.Item>
                        <Pagination.Ellipsis />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Ellipsis />
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            </Container>
            {show &&
                <CustomModal title={selectedProduct.name}>
                    <ProductDetail product={selectedProduct} updateList={fetchProducts} />
                </CustomModal>
            }
        </div>
    )
}

export default ProductList;