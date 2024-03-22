// components/Profile.js
'use client'
import React from 'react';
import { Image, Container, Row, Col } from 'react-bootstrap';

const Profile = ({ user }) => {
    return (
        <Container>
            <Row className="align-items-center">
                <Col md={6} className="d-flex align-items-center">
                    <div style={{ marginLeft: '20px' }}>
                        <Image
                            src={user.photo}
                            alt={user.name}
                            roundedCircle
                            fluid
                            style={{ width: '150px', height: '150px' }}
                        />
                    </div>
                    <div className='ml-2'>
                        <h4>{user.name}</h4>
                    </div>
                </Col>
            </Row>


        </Container >
    );
};

export default Profile;
