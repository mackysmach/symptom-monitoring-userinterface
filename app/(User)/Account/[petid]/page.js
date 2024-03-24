'use client'
import { useState, useEffect, useRef } from 'react';
import { Form, Button, Modal, Col, Row, Container, Image, Dropdown } from 'react-bootstrap';
import { useMyContext } from '@/app/_Handlers/Mycontext';
import { getonepet } from '@/app/_Handlers/Getonepet';
import { useRouter } from 'next/navigation'
import Remindercard from '@/app/_componenets/Remindercard';
import Spinner from 'react-bootstrap/Spinner';
import { getpetimg } from '@/app/_Handlers/Getpetimg';
import { BsPencilSquare } from 'react-icons/bs';
import Editpetimg from '@/app/_Handlers/Editpetimg';
import { deletepetimg } from '@/app/_Handlers/deletepetimg';
import { ToastContainer, toast } from 'react-toastify';
import Addpetimg from '@/app/_Handlers/Addpetimg';


const PetDetails = ({ params }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [image, setimage] = useState('');
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [fileSelected, setFileSelected] = useState(false);
    const { trigger, setTrigger } = useMyContext();
    const [showDeleteModal, setShowDeleteModal] = useState(false);




    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getonepet(params.petid);
                if (data) {
                    setUser(data);
                }
                const url = await getpetimg(params.petid);
                if (url) {
                    setimage(url);
                    setImagePreview(url)
                    console.log(image)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Set loading to false after data fetching is done
            }
        };

        fetchData();
    }, [params.petid, trigger]);

    console.log(image)
    const handleNavigate = () => {
        router.push(`/Account/${params.petid}/Addreminder?petid=${params.petid}`);
    };


    const handleViewFullImage = () => {
        setShowModal(true);
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setImagePreview(image);
        setFileSelected(false)
    };


    const handleEditImage = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileSelected(true); // Set fileSelected to true when file is selected
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleConfirmEdit = async () => {
        const formData = new FormData();

        if (selectedFile) {

            formData.append('image', selectedFile);

        }
        if (image == null||image=='') {
            const formResponse = await Addpetimg(formData, params.petid);
            handleCloseModal();
            setSelectedFile(null);
            toast.success(formResponse.message, {
                autoClose: 1500,
                onClose: () => {
                    setTimeout(() => {
                        setTrigger(prev => prev + 1)
                    }, 1700);
                },
            });
        }
        else {
            const formResponse = await Editpetimg(formData, params.petid);
            handleCloseModal();
            setSelectedFile(null);
            toast.success(formResponse.message, {
                autoClose: 1500,
                onClose: () => {
                    setTimeout(() => {
                        setTrigger(prev => prev + 1)
                    }, 1700);
                },
            });
        }

        setFileSelected(false);
    };
    const handleDeleteConfirm = async () => {
        // Perform deletion action here
        const deleteResponse = await deletepetimg(params.petid);
        toast.success(deleteResponse.message, {
            autoClose: 1500,
            onClose: () => {
                setTimeout(() => {
                    setTrigger(prev => prev + 1)
                }, 1700);
            },
        });
        setShowDeleteModal(false); // Close the delete confirmation modal
        // Handle success or failure response
        console.log(deleteResponse);
    };



    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <>
            <Container className='mb-5'>
                <Row className='align-items-center'>
                    <Col xs={2}>
                        <div style={{
                            position: 'relative',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            margin: 'auto',
                            cursor: 'pointer',
                        }}>
                            <Image src={image} alt={user.name} onClick={handleViewFullImage}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', // Ensure the image fills the container while maintaining aspect ratio
                                }} roundedCircle fluid />
                        </div>
                    </Col>
                    <Col xs={8}>
                        <h2>{user.name}</h2>
                    </Col>

                </Row>
            </Container>
            <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />


            <Modal show={showModal} onHide={handleCloseModal} centered>

                <Modal.Body>
                    <div className="text-center">
                        <Image src={imagePreview} alt="Selected Image" fluid />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="primary" onClick={handleEditImage}>
                        <BsPencilSquare /> Edit Image
                    </Button> */}
                    {fileSelected && (
                        <Button variant="success" onClick={handleConfirmEdit}>
                            Confirm
                        </Button>
                    )}
                    <Dropdown>
                        <Dropdown.Toggle variant="transparent" id={'editpetimage'}>
                            <BsPencilSquare /> Edit Image
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleEditImage}>Change pet image</Dropdown.Item>
                            <Dropdown.Item onClick={() => setShowDeleteModal(true)}>Delete Reminder</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>


                </Modal.Footer>

            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you want to delete this pet image?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            <div className='mb-3'>
                <Button variant="primary" onClick={handleNavigate}>Add reminder</Button>
            </div>
            <Row >
                <hr style={{ margin: '20px 0', borderColor: '#000', borderWidth: '2px' }} />
            </Row>
            <div>
                <Remindercard petid={params.petid} />
            </div>
            <ToastContainer />
        </>
    );
};

export default PetDetails;


//