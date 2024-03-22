'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Col, Row, Overlay, Tooltip } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Addhourreminder from '../_Handlers/Addhourreminder';
import Addperiodreminder from '../_Handlers/Addperiodreminder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import './Druginfo.css'
import { getusertime } from '../_Handlers/Getusertime';
import { json } from 'react-router-dom';

const DrugInfoForm = ({ drugInfo, user_id, pet_id }) => {
    console.log(user_id)
    console.log(pet_id)
    const [showOverlay, setShowOverlay] = useState(false);
    const helpButtonRef = useRef(null); // Ref for the help button
    const [CustomFrequency, setCustomFrequency] = useState(null);
    // Function to handle help button click
    const handleHelpButtonClick = () => {
        setShowOverlay(!showOverlay);
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

    const convertToSimpleTime = (isoString) => {
        if (!isoString) return '';
        const dateObj = new Date(isoString);
        const simpleTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return simpleTime;
    };
    useEffect(() => {
        const fetchDefaultTimes = async () => {
            try {
                const userTime = await getusertime(user_id);
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
    }, [user_id]);




    useEffect(() => {
        if (drugInfo) {
            const { drug_name, drug_usage, reminder_type, every, frequency, morning, noon, evening, before_bed } = drugInfo;
            const updatedFormData = {
                drug_name,
                drug_usage,
                reminder_type,
                frequency,
                every: drugInfo.hasOwnProperty('every') ? every : '',
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
    }, [drugInfo]);


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
        } 
         else {
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
                "pet_id": pet_id, // Adjust as needed
                "user_id": user_id, // Adjust as needed
                "drug_name": formData.drug_name,
                "drug_usage": formData.drug_usage,
            };
            const convertToISOStringThaiTime = (time) => {
                if (!time) return null;
                const [hours, minutes] = time.split(':').map(Number);
                const dateObj = new Date();
                dateObj.setUTCHours(hours);
                dateObj.setUTCMinutes(minutes);


                const isoStringThaiTime = dateObj.toISOString().replace('Z', '+07:00');
                // const isoStringThaiTime = dateObj.toISOString()
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
            else if(formData.frequency==='custom'){
                jsonData={
                    ...jsonData,
                    'frequency': parseInt(CustomFrequency)
                }
            }
            console.log(CustomFrequency)

            // Check the reminder type
            if (formData.reminder_type === 'hour') {
                jsonData = {
                    ...jsonData,
                    "first_usage": convertToISOStringThaiTime(formData.first_usage),
                    "every": parseInt(formData.every),
                };
                const formResponse = await Addhourreminder(jsonData);
                console.log(formResponse)
                toast.success(formResponse.message, {
                    autoClose: 1500,
                    onClose: () => {
                        setTimeout(() => {
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
                const formResponse = await Addperiodreminder(jsonData);
                console.log(formResponse)
                toast.success(formResponse.message, {
                    autoClose: 1500,
                    onClose: () => {
                        setTimeout(() => {
                        }, 1700);
                    },
                });


            }

            console.log(jsonData)
            setFormData({
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
                    morning: '',
                    noon: '',
                    evening: '',
                    before_bed: '',
                },
            });
        } catch (error) {
            // Handle errors
            console.error('Error submitting form data:', error);
        }
    };


    // const [showModal, setShowModal] = useState(false);

    // const handleShowModal = () => {
    //     setShowModal(true);
    // };

    // const handleCloseModal = () => {
    //     setShowModal(false);
    // };

    // const handleImageSubmit = (imageData) => {
    //     // Handle image data in the parent component
    //     console.log('Image data received in parent component:', imageData);
    // };
    console.log(CustomFrequency)

    return (
        <>
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
                            placeholder='ตัวอย่างชื่อยา: paracetamol'
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
                            <option value="every other day">วันเว้นวัน</option>
                            <option value="every day">ทุกวัน</option>
                            <option value="custom">กำหนดจำนวนวันด้วยตนเอง</option> {/* New option */}
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

        </>
    );
};

export default DrugInfoForm;
