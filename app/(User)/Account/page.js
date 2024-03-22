'use client'
import { Row, Col, Container } from "react-bootstrap";
import './page.css'
import { useMyContext } from '../../_Handlers/Mycontext';
import { useEffect,useState } from "react";
import dynamic from 'next/dynamic'
const Profilecomponent = dynamic(() => import("@/app/_componenets/Userprofile"), { ssr: false })
const Addpetbuttoncomponent = dynamic(() => import("@/app/_componenets/Addpetbutton"), { ssr: false })
const Petprofilecomponent = dynamic(() => import("@/app/_componenets/Petprofile"), { ssr: false })
import { getallpet } from "@/app/_Handlers/Getallpet";

function Account() {

    const storedLineProfile = typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('lineProfile')) || {}
        : {};
    const user = {
        name: storedLineProfile.displayName,        
        photo: storedLineProfile.pictureUrl,
        user_id: storedLineProfile.userId
    };
    const [pets, setPets] = useState([]);

    useEffect(() => {
        // Fetch pets data
        getallpet(user.user_id).then(data => {
            if (Array.isArray(data)) {
                setPets(data);
            }
        });
    }, [user.user_id]);

    return (
        <Container sm={12}>
            <Row className="mb-5">
                <Profilecomponent user={user} />
            </Row>
            <Row className="mt-3">
                <Col md={6} xs={7} sm={6} lg={6} className='flex-search-container'>
                    <h4>My pets</h4>
                </Col>
                <Col md={2} xs={1} sm={2} lg={2}></Col>
                <Col md={4} xs={4} sm={4} lg={4} className='flex-button-container'>
                    <Addpetbuttoncomponent user={user.user_id} />
                </Col>
            </Row>
            <Row >
                <hr style={{ margin: '20px 0', borderColor: '#000', borderWidth: '2px' }} />
            </Row>
            <Row>
                {pets.length > 0 ? (
                    <Petprofilecomponent user={user} />
                ) : (
                    <Col className="text-center mt-4">
                        <p>You have no pets</p>
                    </Col>
                )}
            </Row>
        </Container>
    );

};
export default Account;