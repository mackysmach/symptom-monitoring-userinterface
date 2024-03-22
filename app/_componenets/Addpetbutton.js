'use client'
import React from 'react';
import { useState, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './Addpetbutton.css'
import Addnewpet from '../_Handlers/Addnewpet';
import { ToastContainer, toast } from 'react-toastify';
import { useMyContext } from '../_Handlers/Mycontext';

function Addpetbutton(user) {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [fileInput, setFileInput] = useState(null);
    const formRef = useRef(null);
    const { trigger, setTrigger } = useMyContext();
 const json_data = {
        user_id: user.user,
        name: input1
    }


    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (input1 ) {
            try {

                const formResponse = await Addnewpet(json_data);
                console.log(formResponse.message);
                console.log(user.user)


                handleCloseModal();
                setInput1('');
                setInput2('');
                toast.success(formResponse.message, {
                    autoClose: 1500,
                    onClose: () => {
                        setTimeout(() => {
                            setTrigger(prev => prev + 1)
                        }, 1700);
                    },
                });
console.log(trigger)

            } catch (error) {
                console.error('Error:', error);
                toast.error('Error adding pet. Please try again.');

            }
        } else {
            console.log('Please fill in all inputs.');
        }
    };


    return (
        <>
            <Button variant='success' className='Addbutton' onClick={handleShowModal}>New Pet</Button>

            <Modal show={showModal} onHide={handleCloseModal} centered size='lg' >
                <Modal.Header className="text-center p-3">
                    <Modal.Title className="mx-auto">Add new pet</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-5'>
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <Form.Group controlId="formInput1" className="position-relative mb-4">
                            <Form.Control
                                type="text"
                                placeholder="Pet Name "
                                value={input1}
                                style={{ width: '70%', backgroundColor: '#EEEFF4', borderRadius: '12px', height: '50px' }}
                                onChange={(e) => setInput1(e.target.value)}
                                required
                            />

                        </Form.Group>

                        <Form.Group controlId="formInput2" className="position-relative mb-4">
                            <Form.Control
                                type="text"
                                placeholder="Pet type"
                                value={input2}
                                style={{ width: '70%', backgroundColor: '#EEEFF4', borderRadius: '12px', height: '50px' }}
                                onChange={(e) => setInput2(e.target.value)}
                            />

                        </Form.Group>

                       
                        <Modal.Footer className="d-flex justify-content-center align-items-center">
                            <Button variant="success" onClick={handleCloseModal} type='submit' disabled={!input1 }>
                                Insert
                            </Button>

                            <Button variant="danger" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                        </Modal.Footer>

                    </Form>

                </Modal.Body>

            </Modal>
            <ToastContainer />

        </>

    );
};

export default Addpetbutton;