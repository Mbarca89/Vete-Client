import "./ConfirmBill.css"
import { Alert, Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { afipResponse, billFormValues, billProduct } from "../../types";
import { useRef, useState, useEffect } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import handleError from "../../utils/HandleErrors";

interface ConfirmBillProps {
    billResult: afipResponse;
    values: billFormValues;
    products: billProduct[];
    submit: () => void;
}

const ConfirmBill: React.FC<ConfirmBillProps> = ({ submit, billResult, values, products }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const pdfTemplateRef = useRef<HTMLDivElement | null>(null);

    const generateAndDownloadPdf = async () => {
        if (!pdfTemplateRef.current) return;

        setLoading(true);

        const input = pdfTemplateRef.current;

        try {
            const scale = 1.5;
            const canvas = await html2canvas(input, { scale });
            const imgData = canvas.toDataURL('image/jpeg', 0.8);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 1;

            const contentWidth = 210;
            const contentHeight = 297;
            const pdfScale = Math.min((pdfWidth - margin * 2) / contentWidth, (pdfHeight - margin * 2) / contentHeight);

            const scaledWidth = contentWidth * pdfScale;
            const scaledHeight = contentHeight * pdfScale;

            const xOffset = margin;
            const yOffset = margin;

            pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `Factura 0006-${values.number.toString().padStart(8, "0")}.pdf`;
            link.click();

            URL.revokeObjectURL(pdfUrl);
        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {billResult.status == "R" || billResult.status == "" ?
                <Container>
                    <Alert variant="danger" className="text-center">Error al generar comprobante</Alert>
                    {billResult.errors?.length ?
                        <div>
                            <p className="lead">Errores:</p>
                            {billResult.errors?.map((error: any) => (
                                <div key={error.code}>
                                    <p>Código: {error.code}</p>
                                    <p>{error.msg}</p>
                                    <hr />
                                </div>
                            ))}
                        </div>:null}
                    {billResult.observations?.length ?
                        <div className="d-flex flex-column">
                            <p className="lead">Observaciones:</p>

                            {billResult.observations.map((observation: any) => (
                                <div key={observation.code}>
                                    <p>Código: {observation.code}</p>
                                    <p>{observation.msg}</p>
                                    <hr />
                                </div>
                            ))}
                        </div>:null}
                </Container>
                :
                <Container className="overflow-auto">
                    <Row>
                        <Alert variant="success" className="text-center">Comprobante generado correctamente</Alert>
                        {billResult.observations?.length > 0 &&
                            <div className="d-flex flex-column">
                                <p className="lead">Observaciones:</p>

                                {billResult.observations?.map((observation: any) => (
                                    <div key={observation.code}>
                                        <p>Código: {observation.code}</p>
                                        <p>{observation.msg}</p>
                                        <hr />
                                    </div>
                                ))}
                            </div>}
                    </Row>
                    <Container ref={pdfTemplateRef} className="pdf-template text-nowrap d-flex flex-column gap-1">
                        <Row className="border">
                            <Col className="border d-flex flex-column justify-content-between" xl={5} xs={5}>
                                <h1 className="">VETERINARIA DEL PARQUE</h1>
                                <div>
                                    <p><b>Razón social: </b>TEMOLI HECTOR ANDRES</p>
                                    <p><b>Domicilio comercial: </b>Rio Bamba 2123 - San Luis, San Luis</p>
                                    <p><b>Condición frente al IVA: IVA Responsable Inscripto</b></p>
                                </div>
                            </Col>
                            <Col xl={2} xs={2}>
                                <div className="d-flex flex-column justify-content-center align-items-center border">
                                    <h2>{values.type == "1" ? "A" : "B"}</h2>
                                    <h6>{values.type == "1" ? "Cod: 001" : "Cod: 006"}</h6>
                                </div>
                            </Col>
                            <Col className="border d-flex flex-column justify-content-between" xl={5} xs={5}>
                                <div>
                                    <h1>FACTURA</h1>
                                    <div className="d-flex gap-5">
                                        <p><b>Punto de venta: 0002</b></p>
                                        <p><b>{`Comp. Nro: ${values.number.toString().padStart(8, "0")}`}</b></p>
                                    </div>
                                </div>
                                <div>
                                    <p><b>{`Fecha de emisión: ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</b></p>
                                    <p><b>CUIT: </b>20292322454</p>
                                    <p><b>Ingresos Brutos: </b>1220292322454</p>
                                    <p><b>Fecha de inicio de Actividades: </b>01/06/2011</p>
                                </div>
                            </Col>
                        </Row>
                        <Row className="border">
                            <Col>
                                <div className="">
                                    <p><b>{values.type == "1" ? 'CUIT: ' : 'DNI: '}</b>{values.cuit ? values.cuit : ""}</p>
                                    <p><b>Nombre / Razón social: </b>{values.name ? values.name : ""}</p>
                                    <p><b>Condición frente al IVA: </b>{values.condicionIvaDescripcion ? values.condicionIvaDescripcion : ""}</p>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-5">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th className="col-2">Código</th>
                                        <th className="col-4">Descripcion</th>
                                        <th className="col-1">Cantidad</th>
                                        <th className="col-1">Precio unitario</th>
                                        {values.type == "1" && <th className="col-1">Subtotal</th>}
                                        {values.type == "1" && <th className="col-1">Iva (21%)</th>}
                                        <th className="col-1">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products?.map((product, index) => <tr key={String(product.barCode)}>
                                        <td>{product.barCode}</td>
                                        <td>{product.description}</td>
                                        <td>{product.quantity}</td>
                                        <td>{values.type == "1" ? product.netPrice : product.price}</td>
                                        {values.type == "1" && <td>{(product.netPrice * product.quantity).toFixed(2)}</td>}
                                        {values.type == "1" && <td>{(product.iva * product.quantity).toFixed(2)}</td>}
                                        <td>{values.type == "1" ? ((product.netPrice + product.iva) * product.quantity).toFixed(2) : product.price * product.quantity}</td>
                                    </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Row>
                        <Row className="mt-5 mb-5"></Row>
                        <Row className="border mt-5 p-2">
                            <div className='container d-flex flex-column justify-content-end align-items-end'>
                                {values.type == "1" && <h6>{`Subtotal: $${(products.reduce((total, product) => total + (product.netPrice), 0)).toFixed(2)}`}</h6>}
                                {values.type == "1" && <h6>{`Iva (21%): $${(products.reduce((total, product) => total + (product.iva), 0).toFixed(2))}`}</h6>}
                                <h5>{`Importe Total: $${(products.reduce((total, product) => total + (product.quantity * product.price), 0)).toFixed(2)}`}</h5>
                            </div>
                        </Row>
                        <Row className="border p-5">
                            <Col className=" d-flex flex-row justify-content-between">
                                <div className="d-flex flex-column">
                                    <img className="w-50" src="/images/afip.png" alt="" />
                                    <p><b>Comprobante autorizado</b></p>
                                </div>
                                <div>
                                    <p><b>CAE Nº:</b> {billResult.cae}</p>
                                    <p><b>Fecha de Vto. de CAE: </b>{`${billResult.caeFchVto?.slice(6, 8)}/${billResult.caeFchVto?.slice(4, 6)}/${billResult.caeFchVto?.slice(0, 4)}`}</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <Row className="mt-5 d-flex justify-content-center">
                        <Button className="w-50" onClick={generateAndDownloadPdf}>{!loading ? "Descargar" : <Spinner />}</Button>
                    </Row>
                </Container>
            }
        </>
    );
}

export default ConfirmBill;
