import "./PetReport.css"
import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import CustomModal from '../../components/Modal/CustomModal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Spinner } from 'react-bootstrap';

const PetReport = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const formRef = useRef<HTMLDivElement | null>(null);
    const pdfTemplateRef = useRef<HTMLDivElement | null>(null);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [data, setData] = useState({
        date: "",
        name: "",
        race: "",
        species: "",
        gender: "",
        weight: "",
        ownerName: "",
        phone: "",
        reason: "",
        find: "",
        diagnosis: "",
        recomendation: ""
    })


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    setImage(e.target.result);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const resetForm = () => {
        setData({
            date: '',
            name: '',
            race: '',
            species: '',
            gender: '',
            weight: '',
            ownerName: '',
            phone: '',
            reason: '',
            find: '',
            diagnosis: '',
            recomendation: ''
        });
        setImage(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        setPdfData(null)
    };

    const generatePdf = async () => {
        if (!pdfTemplateRef.current) return;

        setLoading(true);

        const input = pdfTemplateRef.current;

        try {
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            const contentWidth = input.offsetWidth;
            const contentHeight = input.offsetHeight;
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            let scale = 1;
            if (contentWidth > pdfWidth || contentHeight > pdfHeight) {
                // If content exceeds page size, scale down to fit within page dimensions
                scale = Math.min(pdfWidth / contentWidth, pdfHeight / contentHeight);
            }

            const scaledWidth = contentWidth * scale;
            const scaledHeight = contentHeight * scale;
            const xOffset = (pdfWidth - scaledWidth) / 2;
            const yOffset = (pdfHeight - scaledHeight) / 2;
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

            if (image) {
                pdf.addPage();
                pdf.addImage(image as string, 'PNG', 10, 10, 100, 100); // Adjust dimensions and position as needed
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfData(pdfUrl);

            const formData = new FormData();
            formData.append('file', pdfBlob, 'generated.pdf');

        } catch (error) {
            console.error('Error generating or sending PDF', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = () => {
        if (pdfData) {
            const link = document.createElement('a');
            link.href = pdfData;
            link.download = `Informe ${data.name} ${data.date}.pdf`;
            link.click();
        }
    };

    return (
        <>
            <div className='container d-flex flex-column flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2 overflow-auto'>
                {/* Formulario */}
                <div ref={formRef}>
                    <h1>Generar informe</h1>
                    <Form noValidate>
                        <Row className="mb-2">
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control type="date"
                                    id="date"
                                    name="date"
                                    value={data.date}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <h2 className='fs-3 text-start mt-5'>Datos del paciente: </h2>
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Nombre"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Raza</Form.Label>
                                <Form.Control type="text" placeholder="Raza"
                                    id="race"
                                    name="race"
                                    value={data.race}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Especie</Form.Label>
                                <Form.Select
                                    id="species"
                                    name="species"
                                    value={data.species}
                                    onChange={handleSelect}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Canino">Canino</option>
                                    <option value="Felino">Felino</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Género</Form.Label>
                                <Form.Select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={handleSelect}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Peso (kg)</Form.Label>
                                <Form.Control type="number"
                                    id="weight"
                                    name="weight"
                                    value={data.weight}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <h2 className='fs-3 text-start mt-5'>Datos del propietario:</h2>
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Nombre"
                                    id="ownerName"
                                    name="ownerName"
                                    value={data.ownerName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="text" placeholder="Teléfono"
                                    id="phone"
                                    name="phone"
                                    value={data.phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <h2 className='fs-3 text-start mt-5'>Detalles:</h2>
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Motivo</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Motivo"
                                    id="reason"
                                    name="reason"
                                    value={data.reason}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} xs={12} md={12}>
                                <Form.Label>Hallazgos</Form.Label>
                                <Form.Control as="textarea"
                                    placeholder="Hallazgos"
                                    id="find"
                                    name="find"
                                    value={data.find}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} xs={12} md={12}>
                                <Form.Label>Diagnostigo presuntivo</Form.Label>
                                <Form.Control as="textarea"
                                    placeholder="Diagnostigo presuntivo"
                                    id="diagnosis"
                                    name="diagnosis"
                                    value={data.diagnosis}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} xs={12} md={12}>
                                <Form.Label>Recomendación</Form.Label>
                                <Form.Control as="textarea"
                                    placeholder="Recomendación"
                                    id="recomendation"
                                    name="recomendation"
                                    value={data.recomendation}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="mt-5 mb-5 m-auto" as={Col} xs={12} md={6}>
                                <Form.Label>Imagen</Form.Label>
                                <Form.Control type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={inputRef}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Button className="" variant="danger" onClick={resetForm}>
                                        Reiniciar
                                    </Button>
                                </div>
                                {!loading ?
                                    <div className='d-flex align-items-center justify-content-center w-25'>
                                        <Button className="" variant="primary" onClick={generatePdf}>
                                            Crear
                                        </Button>
                                    </div> :
                                    <div className='d-flex align-items-center justify-content-center w-25'>
                                        <Spinner />
                                    </div>}
                            </Form.Group>
                            <div className="mt-5">
                                <Button disabled={pdfData == null} className="" variant="primary" onClick={downloadPdf}>
                                    Descargar
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </div>

                {/* PDF Template */}
                <div ref={pdfTemplateRef} className='offscreen container d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-center mb-5'>
                        <img src="/images/logook.png" style={{ width: "100px" }} alt="" />
                        <h1>Veterinaria del Parque</h1>
                    </div>
                    <div className="text-start mt-5">
                        <h2>Informe diagnóstico por imágenes</h2>
                        <p className='lead'><b>Fecha: </b><span data-input-id="date">{data.date}</span></p>
                    </div>
                    <hr />
                    <div className='text-start'>
                        <p className='fs-5'><b>Datos del paciente:</b></p>
                        <p><b>Nombre: </b><span data-input-id="name">{data.name}</span></p>
                        <p><b>Raza: </b><span data-input-id="race">{data.race}</span></p>
                        <p><b>Especie: </b><span data-input-id="species">{data.species}</span></p>
                        <p><b>Género: </b><span data-input-id="gender">{data.gender}</span></p>
                        <p><b>Peso: </b><span data-input-id="weight">{data.weight}</span></p>
                    </div>
                    <hr />
                    <div className='text-start'>
                        <p className='fs-5'><b>Datos del propietario:</b></p>
                        <p><b>Nombre: </b><span data-input-id="ownerName">{data.ownerName}</span></p>
                        <p><b>Teléfono: </b><span data-input-id="phone">{data.phone}</span></p>
                    </div>
                    <hr />
                    <div className='text-start'>
                        <p className='fs-5'><b>Motivo:</b></p>
                        <p><span data-input-id="reason">{data.reason}</span></p>
                        <p className='fs-5'><b>Hallazgos:</b></p>
                        <p><span data-input-id="find">{data.find}</span></p>
                        <p className='fs-5'><b>Diagnóstigo presuntivo:</b></p>
                        <p><span data-input-id="diagnosis">{data.diagnosis}</span></p>
                        <p className='fs-5'><b>Recomendación:</b></p>
                        <p><span data-input-id="recomendation">{data.recomendation}</span></p>
                    </div>
                    <div className="d-flex justify-content-end">
                        <img style={{ width: "300px" }} src="/images/firma.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PetReport