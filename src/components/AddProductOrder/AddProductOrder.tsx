import { orderProduct, product } from "../../types"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { modalState } from "../../app/store";
import { useRecoilState } from "recoil";
import { ChangeEvent, useState } from "react";
import { notifyError } from "../Toaster/Toaster";

interface AddProductOrderProps {
    product: orderProduct
    addProduct: (product: orderProduct) => void
}

const AddProductOrder: React.FC<AddProductOrderProps> = ({ product, addProduct }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [quantity, setQuantity] = useState<number>(0)
    const [updatedProduct, setUpdatedProduct] = useState<orderProduct>(product)

    const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
        if(event.target.name === "quantity") setQuantity(Number(event.target.value))
        setUpdatedProduct({
            ...updatedProduct,
            [event.target.name]: event.target.value
        })
    }

    const handleAddProduct = () => {
        if(quantity <= 0) {
            notifyError("Ingrese la cantidad")
        } else {
            addProduct(updatedProduct)
        }
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="col-4">Producto</th>
                        <th className="col-2">Costo</th>
                        <th className="col-2">Precio</th>
                        <th className="col-2">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={String(product.productName)}>
                        <td className=''>{product.productName}</td>
                        <td>
                            <Form.Control
                                type="number"
                                name="productCost"
                                placeholder={String(product.productCost)}
                                onChange={handleChange}
                            />
                        </td>
                        <td>
                            <Form.Control
                                type="number"
                                name="productPrice"
                                placeholder={String(product.productPrice)}
                                onChange={handleChange}
                            />
                        </td>
                        <td>
                            <Form.Control
                                type="number"
                                name="quantity"
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Container className='d-flex gap-2 justify-content-center p-1'>
                <Button variant="danger" onClick={() => setShow(false)}>Cancelar</Button>
                <Button onClick={handleAddProduct} >Confirmar</Button>
            </Container>
        </div>
    )
}

export default AddProductOrder