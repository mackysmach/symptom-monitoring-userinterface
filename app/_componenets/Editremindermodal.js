'use client'
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Image, FormGroup, FormCheck, Row, Col, Overlay, Tooltip } from 'react-bootstrap';
import "./Editremindermodal.css";
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useMyContext } from '../_Handlers/Mycontext';
import Editreminder from '../_Handlers/Editreminder';
import { getreminder } from '../_Handlers/Getreminder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { getusertime } from '../_Handlers/Getusertime';


function EditReminderModal({ show, handleClose, reminder_id, type, reminderdata }) {
    const formRef = useRef(null);
    const [items, setItems] = useState([]);
    const { setTrigger } = useMyContext();
    const [showOverlay, setShowOverlay] = useState(false);
    const helpButtonRef = useRef(null);
    const [CustomFrequency, setCustomFrequency] = useState(null);

    console.log(reminderdata)
    const storedLineProfile = typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('lineProfile')) || {}
        : {};

    const convertToSimpleTime = (isoString) => {
        if (!isoString) return '';
        const dateObj = new Date(isoString);
        const simpleTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return simpleTime;
    };
    const [formData, setFormData] = useState({
        drug_name: '',
        drug_usage: '',
        reminder_type: '',
        frequency: '',
        every: '',
        first_usage: '',
        notify: {
            morning: false,
            noon: false,
            evening: false,
            before_bed: false,
        },
        time: {
            morning: null,
            noon: null,
            evening: null,
            before_bed: null,
        },

    });
    const checkboxLabels = {
        morning: 'เช้า',
        noon: 'เที่ยง',
        evening: 'เย็น',
        before_bed: 'ก่อนนอน',
    };
    useEffect(() => {
        const fetchDefaultTimes = async () => {
            try {
                const userTime = await getusertime(storedLineProfile.userId);
                console.log(userTime)
                if (userTime) {
                    setFormData(prevData => ({
                        ...prevData,
                        time: {
                            morning: userTime.morning ? convertToSimpleTime(userTime.morning) : '', // Convert to Thai time
                            noon: userTime.noon ? convertToSimpleTime(userTime.noon) : '', // Convert to Thai time
                            evening: userTime.evening ? convertToSimpleTime(userTime.evening) : '', // Convert to Thai time
                            before_bed: userTime.before_bed ? convertToSimpleTime(userTime.before_bed) : '', // C
                        },
                    }));
                }
            } catch (error) {
                console.error('Error fetching default time:', error);
            }
        };

        fetchDefaultTimes();
    }, [reminder_id]);
    useEffect(() => {
        if (reminderdata) {
            const { drug_name, drug_usage, every, frequency, morning, noon, evening, before_bed } = reminderdata;
            setCustomFrequency(frequency)
            let updatedFrequency = '';
            if (frequency === 1) {
                updatedFrequency = 'every day';
            } else if (frequency === 2) {
                updatedFrequency = 'every other day';
            } else {
                // Handle other cases here if needed
                updatedFrequency = 'custom'; // Set a default value or handle as per your logic
            }

            const updatedFormData = {
                drug_name,
                drug_usage,
                reminder_type: type,
                frequency: updatedFrequency,
                every: reminderdata.hasOwnProperty('every') ? every : '',
                notify: {
                    morning: !!morning,
                    noon: !!noon,
                    evening: !!evening,
                    before_bed: !!before_bed,
                },
                time: {
                    morning: morning && convertToSimpleTime(morning),
                    noon: noon && convertToSimpleTime(noon),
                    evening: evening && convertToSimpleTime(evening),
                    before_bed: before_bed && convertToSimpleTime(before_bed),
                },
            };

            setFormData(prevFormData => ({
                ...prevFormData,
                ...updatedFormData
            }));
        }

    }, [reminderdata, type]); // 

    const handleHelpButtonClick = () => {
        setShowOverlay(!showOverlay);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'every') {
            setFormData(prevData => ({
                ...prevData,
                every: value
            }));
        } else if (name === 'first_usage') {
            setFormData(prevData => ({
                ...prevData,
                first_usage: value

            }));
        } else if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                notify: {
                    ...prevData.notify,
                    [name]: checked
                }
            }));
        } else {
            if (['morning', 'noon', 'evening', 'before_bed'].includes(name)) {
                setFormData(prevData => ({
                    ...prevData,
                    time: {
                        ...prevData.time,
                        [name]: value
                    }
                }));
            } else {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: value
                }));
            }
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            // Create JSON data object
            let jsonData = {
                "reminder_id": reminder_id,
                "drug_name": formData.drug_name,
                "drug_usage": formData.drug_usage,
                "frequency": formData.frequency,
            };
            const convertToISOStringThaiTime = (time) => {
                if (!time) return null;
                const [hours, minutes] = time.split(':').map(Number);
                const dateObj = new Date();
                dateObj.setUTCHours(hours);
                dateObj.setUTCMinutes(minutes);


                const isoStringThaiTime = dateObj.toISOString().replace('Z', '+07:00');

                return isoStringThaiTime;
            };
            if (formData.frequency === "every day") {
                jsonData = {
                    ...jsonData,
                    "frequency": 1, // Set frequency to 1 for every day
                };
            } else if (formData.frequency === "every other day") {
                jsonData = {
                    ...jsonData,
                    "frequency": 2, // Set frequency to 2 for every other day
                };
            }
            else if (formData.frequency === 'custom') {
                jsonData = {
                    ...jsonData,
                    'frequency': parseInt(CustomFrequency)
                }
            }

            // Check the reminder type
            if (formData.reminder_type === 'hour') {
                jsonData = {
                    ...jsonData,
                    "first_usage": convertToISOStringThaiTime(formData.first_usage),
                    "every": parseInt(formData.every),
                };
                const formResponse = await Editreminder(jsonData, formData.reminder_type);
                console.log(formResponse)
                toast.success(formResponse.message, {
                    autoClose: 1500,
                    onClose: () => {
                        setTimeout(() => {
                            setTrigger(prev => prev + 1)
                            handleClose();

                        }, 1700);
                    },
                });
            } else if (formData.reminder_type === 'period') {

                jsonData = {
                    ...jsonData,
                    "morning": convertToISOStringThaiTime(formData.time.morning),
                    "noon": convertToISOStringThaiTime(formData.time.noon),
                    "evening": convertToISOStringThaiTime(formData.time.evening),
                    "before_bed": convertToISOStringThaiTime(formData.time.before_bed)
                };
                const formResponse = await Editreminder(jsonData, formData.reminder_type);
                console.log(formResponse)
                toast.success(formResponse.message, {
                    autoClose: 1500,
                    onClose: () => {
                        setTimeout(() => {
                            setTrigger(prev => prev + 1)

                            handleClose();
                        }, 1700);
                    },
                });


            }

            console.log(jsonData)

        } catch (error) {
            // Handle errors
            console.error('Error submitting form data:', error);
        }
    };

    console.log(formData);



    return (
        <>
            <Modal show={show} onHide={handleClose} centered size='xl'>
                <Modal.Header className="text-center p-3">
                    <Modal.Title className="mx-auto">Edit Reminder</Modal.Title>
                </Modal.Header>

                <Modal.Body className='p-5'>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} controlId="drugName" className='mb-3 mt-5'>
                            <Form.Label column sm="2">
                                ชื่อยา
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="text"
                                    name="drug_name"
                                    value={formData.drug_name}
                                    onChange={handleChange}
                                    placeholder={items.drug_name}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="usage" classname='mb-3'>
                            <Form.Label column sm="2">
                                วิธีการใช้ยา
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="drug_usage"
                                    value={formData.drug_usage}
                                    onChange={handleChange}
                                    placeholder='ตัวอย่างการใช้ยา: กินทุกวันหนึ่งเม็ดหลังอาหาร'
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="notificationType" className='mt-3'>
                            <Form.Label column sm="2">
                                รูปแบบการแจ้งเตือน
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    as="select"
                                    name="reminder_type"
                                    value={formData.reminder_type}
                                    onChange={handleChange}
                                >
                                    <option value=""></option>
                                    <option value="hour">แจ้งเตือนตามจำนวนชั่วโมง</option>
                                    <option value="period">แจ้งเตือนตามช่วงเวลา</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="frequency" className='mt-3'>
                            <Form.Label column sm="2">
                                ความถี่ในการแจ้งเตือน
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    as="select"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}

                                >
                                    <option value=""></option>
                                    <option value="every other day" selected={formData.frequency === 2}>วันเว้นวัน</option>
                                    <option value="every day" selected={formData.frequency === 1}>ทุกวัน</option>
                                    <option value="custom" selected={formData.frequency >= 3}>กำหนดจำนวนวันด้วยตนเอง</option> {/* New option */}
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="customFrequency" className={`form-group-transition ${formData.frequency === 'custom' ? 'show' : ''} mt-3`}>
                            <Form.Label column sm="2">
                                ทุกๆ กี่วัน
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="number"
                                    min="3"
                                    max="30"  // Change the maximum as needed
                                    placeholder="ระบุจำนวน"
                                    value={CustomFrequency}
                                    onChange={(e) => setCustomFrequency(e.target.value)}
                                    disabled={formData.frequency !== 'custom'}
                                    style={{ width: "150px" }} // Adjust style as needed
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="Every" className={`form-group-transition ${formData.reminder_type === 'hour' ? 'show' : ''} mt-3`}
                        >
                            <Form.Label column sm="2">
                                ทุกๆกี่ชั่วโมง
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="text"
                                    name="every"
                                    value={formData.every}
                                    onChange={handleChange}
                                    disabled={formData.reminder_type === 'period'}
                                    placeholder='ใส่เป็นตัวเลขจำนวนชั่วโมงเช่น 12'
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="first_usage" className={`form-group-transition ${formData.reminder_type === 'hour' ? 'show' : ''} mt-3 `}
                        >
                            <Form.Label column sm="2" >
                                เวลาที่ใช้ยาครั้งแรก
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="time"
                                    name="first_usage"
                                    value={formData.first_usage}
                                    disabled={formData.every === ''}
                                    onChange={handleChange}

                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="notificationTime" className={`form-group-transition ${formData.reminder_type === 'period' ? 'show' : ''} mt-3`}
                        >
                            <Form.Label column sm="2">   เวลาที่แจ้งเตือน{' '}
                                <FontAwesomeIcon icon={faQuestionCircle} style={{ cursor: 'pointer' }} onClick={handleHelpButtonClick} ref={helpButtonRef} />
                            </Form.Label>
                            <Col sm="10">
                                {Object.entries(formData.notify).map(([time, isChecked]) => (
                                    <div key={time}>
                                        <Form.Check
                                            type="checkbox"
                                            label={checkboxLabels[time]}
                                            name={time}
                                            checked={isChecked}
                                            onChange={handleChange}
                                            disabled={formData.reminder_type === 'hour'}
                                        />
                                        <Form.Control
                                            type="time"
                                            name={time}
                                            value={formData.time[time]}
                                            onChange={handleChange}
                                            disabled={!isChecked}
                                        />
                                    </div>
                                ))}
                            </Col>
                        </Form.Group>

                        <Button variant="primary" type="submit" className='mt-4'>
                            ยืนยัน
                        </Button>
                    </Form>
                    <Overlay target={helpButtonRef.current} show={showOverlay} placement="right">
                        {(props) => (
                            <Tooltip id="overlay-tooltip" className="custom-tooltip" {...props} >
                                <div>
                                    <h5>เวลาที่ตั้งค่าจะเป็นเวลาที่ผู้ใช้งานได้รับการแจ้งเตือน</h5>
                                    <p>- หากต้องมีการรับประทานยาก่อนอาหารแนะนำว่าควรตั้งเวลาแจ้งเตือนก่อนเวลาอาหารประมาณ 30นาที</p>
                                </div>
                            </Tooltip>
                        )}
                    </Overlay>
                    <ToastContainer />

                </Modal.Body>
            </Modal>
        </>
    );
}

export default EditReminderModal;
