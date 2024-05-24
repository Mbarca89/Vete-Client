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
import handleError from '../../utils/HandleErrors';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const ProductList = () => {
    const [loading, setLoading] = useState(false)
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
        image: "",
        thumbnail: ""
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;
    const visiblePages = 5;

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/v1/products/getProductsPaginated?page=${currentPage}&size=${pageSize}`)
            if (res.data) {
                setTotalPages(Math.ceil(res.data.totalCount / pageSize));
                setProducts(res.data.data);
            }
        } catch (error: any) {
            handleError(error)
        }
        setLoading(false)
    };

    const handleDetail = (product: product) => {
        setSelectedProduct(product)
        setShow(!show)
    }

    const handleSearch = async (event: any) => {
        setLoading(true)
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
            setLoading(false)
        } catch (error: any) {
            notifyError(error.response.data)
            setLoading(false)
        }
    }

    const handleResetSearch = (event: any) => {
        if (event.target.value == "") fetchProducts()
    }

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

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
                                <Card.Img style={{ height: '150px', width: "auto", objectFit: "contain" }} className='custom-card-img p-1 rounded' variant="top" src={product.thumbnail ? `data:image/jpeg;base64,${product.thumbnail}` : noImage} alt={product.name} />
                                <Card.Body className='d-flex flex-column justify-content-end'>
                                    <Card.Title className=''>{product.name}</Card.Title>
                                    <Card.Text>{product.categoryName}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                    }
                </Row> : <div className='mt-5'>
                    <Spinner />
                </div>}
                <div className='d-flex m-auto justify-content-center mt-5 w-50'>
                    <Pagination className='mt-5'>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {currentPage > 2 && <Pagination.Item
                            key={currentPage - 2}
                            onClick={() => handlePageChange(currentPage - 2)}
                        >
                            {currentPage - 2}
                        </Pagination.Item>}
                        {currentPage > 1 && <Pagination.Item
                            key={currentPage - 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            {currentPage - 1}
                        </Pagination.Item>}
                        <Pagination.Item
                            key={currentPage}
                            active
                            onClick={() => handlePageChange(currentPage)}
                        >
                            {currentPage}
                        </Pagination.Item>
                        {currentPage <= totalPages - 1 && <Pagination.Item
                            key={currentPage + 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            {currentPage + 1}
                        </Pagination.Item>}
                        {currentPage <= totalPages - 2 && <Pagination.Item
                            key={currentPage + 2}
                            onClick={() => handlePageChange(currentPage + 2)}
                        >
                            {currentPage + 2}
                        </Pagination.Item>}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            </Container>
            {show &&
                <CustomModal title={selectedProduct.name}>
                    <ProductDetail productId={selectedProduct.id} updateList={fetchProducts} />
                </CustomModal>
            }
        </div>
    )
}

export default ProductList;