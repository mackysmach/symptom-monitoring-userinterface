'use client'
import { useState, useEffect } from 'react';
import { Form, Button, Modal, Col, Row, Container } from 'react-bootstrap';
import DrugInfoForm from '@/app/_componenets/Druginfo';
import ImageInputModal from '@/app/_componenets/Imageinput';
import { getonepet } from '@/app/_Handlers/Getonepet';
import { useRouter } from 'next/navigation'
import Remindercard from '@/app/_componenets/Remindercard';
import Spinner from 'react-bootstrap/Spinner';

const PetDetails = ({ params }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Loading state

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data =await getonepet(params.petid);
                if (data) {
                    setUser(data.name);
                }
               
            } catch (error) {
                console.error('Error fetching data:', error);
            }finally {
                setLoading(false); // Set loading to false after data fetching is done
            }
        };

        fetchData();
    }, [params.petid]);
    const handleNavigate = () => {
        router.push(`/Account/${params.petid}/Addreminder?petid=${params.petid}`);
    };
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center ">
                <Spinner animation="border" />
            </div>
        );
    }
    return (
        <>
            <div className='mb-5'>
                <h2>{user}</h2>
            </div>

            <div className='mb-3'>
                <Button variant="primary" onClick={handleNavigate}>Add reminder</Button>
            </div>
            <div>
                <Remindercard petid={params.petid} />
            </div>

        </>
    );
};

export default PetDetails;
