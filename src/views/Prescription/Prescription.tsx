import "./Prescription.css"
import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Container, Spinner } from 'react-bootstrap';
import handleError from "../../utils/HandleErrors";
import { notifySuccess } from "../../components/Toaster/Toaster";
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import CustomModal from "../../components/Modal/CustomModal";
import SendPrescription from "../../components/SendPrescription/SendPrescription";


const Prescription = () => {

    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLDivElement | null>(null);
    const pdfTemplateRef = useRef<HTMLDivElement | null>(null);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [imgData, setImgData] = useState<string | null>(null);
    const [data, setData] = useState({
        date: "",
        name: "",
        content: "",
    })

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
            content: '',
        });
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
            // Obtener dimensiones reales del elemento
            const rect = input.getBoundingClientRect();
            const scale = 2; // Aumenta la resolución de la imagen sin cambiar las dimensiones visibles

            // Generar la imagen del HTML
            const canvas = await html2canvas(input, {
                scale: scale, // Mejora la calidad de la imagen
                useCORS: true, // Si usas imágenes externas
            });

            const imgData = canvas.toDataURL('image/png');
            setImgData(imgData);

            // Convertir dimensiones a mm (1 pixel ≈ 0.2645 mm)
            const widthMM = rect.width * 0.2645;
            const heightMM = rect.height * 0.2645;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [widthMM, heightMM], // Ajusta el PDF al tamaño del HTML
            });

            // Ajustar la imagen al tamaño del PDF
            pdf.addImage(imgData, 'PNG', 0, 0, widthMM, heightMM);

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfData(pdfUrl);

            const formData = new FormData();
            formData.append('file', pdfBlob, 'generated.pdf');

            notifySuccess("Receta creada correctamente.");
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = () => {
        if (pdfData) {
            const link = document.createElement('a');
            link.href = pdfData;
            link.download = `receta ${data.name}.pdf`;
            link.click();
        }
    };

    const sendImg = () => {
        setShow(true)
    }

    console.log(data.content)

    return (
        <>
            <div className='container d-flex flex-column flex-grow-1 p-lg-3 p-sm-0 rounded custom m-2'>
                {/* Formulario */}
                <div ref={formRef}>
                    <h1>Generar Receta</h1>
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
                            <Form.Group as={Col} xs={12} md={6}>
                                <Form.Label>Nombre de la mascota</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Nombre"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='mt-5 mb-5'>
                            <h3 className='text-start'>Contenido</h3>
                            <ReactQuill style={{ height: '300px' }}
                                modules={{
                                    toolbar: {
                                        container: [
                                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                            ["bold", "italic", "underline"],
                                            [{ list: "ordered" }, { list: "bullet" }],
                                            [{align: []}],
                                        ]
                                    },
                                }}

                                theme='snow'
                                className=""
                                id='content'
                                onChange={(value) => setData({
                                    ...data,
                                    content: value
                                })}
                            />
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
                            <div className="d-flex justify-content-center mt-5">
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Button disabled={pdfData == null} className="" variant="primary" onClick={downloadPdf}>
                                        Descargar
                                    </Button>
                                </div>
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Button disabled={pdfData == null} className="" variant="primary" onClick={sendImg}>
                                        Enviar
                                    </Button>

                                </div>
                            </div>
                        </Row>
                    </Form>
                </div>

                {/* PDF Template */}
                <div
                    ref={pdfTemplateRef}
                    className="offscreen2 container d-flex flex-column justify-content-between bg-light"
                    style={{
                        width: "100mm", // 10 cm en milímetros
                        padding: "1mm", // Puedes ajustar esto si quieres espacio dentro de la receta
                        overflow: "hidden"
                    }}
                >
                    {/* Contenido de la receta */}
                    <div className="d-flex align-items-center justify-content-between" style={{ height: "20mm" }}>
                        <div className="d-flex align-items-center">
                            <img src="/images/logook.png" style={{ width: "10mm" }} alt="" />
                            <p className="m-0"><b>Veterinaria del Parque</b></p>
                        </div>
                        <div className="text-start d-flex align-items-end">
                            <p className="lead m-0 fs-6">
                                <b>Fecha: </b>
                                <span data-input-id="date">{new Date(`${data.date}T00:00:00`).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div className="text-start" style={{ height: "10mm" }}>
                        <p className="lead m-0 fs-">
                            <b>Paciente: </b>
                            <span data-input-id="name">{data.name}</span>
                        </p>
                    </div>
                    <hr />
                    <div className="prescription-content mt-3 text-start">
                        <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-end" style={{ height: "30mm" }}>
                        <img style={{ width: "30mm" }} src="/images/firma.png" alt="" />
                    </div>
                </div>
            </div>
            {show && <CustomModal title="Vista previa">
                <SendPrescription image={imgData}></SendPrescription>
            </CustomModal>}
        </>
    )
}

export default Prescription