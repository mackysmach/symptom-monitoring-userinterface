'use client'
import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { getusertime } from '@/app/_Handlers/Getusertime';
import Editusertime from '@/app/_Handlers/Editusertime';

const TimeSettingPage = () => {
    const storedLineProfile = typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('lineProfile')) || {}
        : {};
    const user_id = storedLineProfile.userId;
    console.log(user_id)
    const [timeSettings, setTimeSettings] = useState({
        morning: '',
        noon: '',
        evening: '',
        before_bed: '',
    });

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
    const convertToSimpleTime = (isoString) => {
        if (!isoString) return '';
        const dateObj = new Date(isoString);
        const simpleTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return simpleTime;
    };

    const handleTimeChange = (timeSlot, value) => {
        setTimeSettings(prevSettings => ({
            ...prevSettings,
            [timeSlot]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jsonData = {
            user_id: user_id,
            morning: convertToISOStringThaiTime(timeSettings.morning),
            noon: convertToISOStringThaiTime(timeSettings.noon),
            evening: convertToISOStringThaiTime(timeSettings.evening),
            before_bed: convertToISOStringThaiTime(timeSettings.before_bed),
        };
        console.log(jsonData)
        try {
            const response = await Editusertime(jsonData);
            console.log(response.message);
            // Add any logic for handling the response as needed
        } catch (error) {
            console.error('Error editing user time:', error);
            // Handle the error
        }
    };


    useEffect(() => {
        const fetchDefaultTimeSettings = async () => {
            try {
                const userTime = await getusertime(user_id);
                setTimeSettings({
                    morning: userTime.morning ? convertToSimpleTime(userTime.morning) : '', // Convert to Thai time
                    noon: userTime.noon ? convertToSimpleTime(userTime.noon) : '', // Convert to Thai time
                    evening: userTime.evening ? convertToSimpleTime(userTime.evening) : '', // Convert to Thai time
                    before_bed: userTime.before_bed ? convertToSimpleTime(userTime.before_bed) : '', // Convert to Thai time
                });
            } catch (error) {
                console.error('Error fetching default time settings:', error);
            }
        };

        fetchDefaultTimeSettings();
    }, [user_id]);

    return (
        <div className="container">
            <h2>Time Setting </h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="morningTime">
                    <Form.Label column sm="3">Morning:</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="time"
                            value={timeSettings.morning}
                            onChange={(e) => handleTimeChange('morning', e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="noonTime">
                    <Form.Label column sm="3">Noon:</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="time"
                            value={timeSettings.noon}
                            onChange={(e) => handleTimeChange('noon', e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="eveningTime">
                    <Form.Label column sm="3">Evening:</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="time"
                            value={timeSettings.evening}
                            onChange={(e) => handleTimeChange('evening', e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="beforeBedTime">
                    <Form.Label column sm="3">Before Bed:</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="time"
                            value={timeSettings.before_bed}
                            onChange={(e) => handleTimeChange('before_bed', e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
};

export default TimeSettingPage;
