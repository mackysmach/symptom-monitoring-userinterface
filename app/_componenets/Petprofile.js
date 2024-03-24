'use client'
import React, { useEffect, useState } from 'react';
import { Image, Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { getallpet } from '../_Handlers/Getallpet';
import { useMyContext } from '../_Handlers/Mycontext';
import { getpetimg } from '../_Handlers/Getpetimg';


    
    async function fetchData(userID, setPets) {
        try {
            const pets = await getallpet(userID)
            let i = 0
            for (const pet of pets) {
                let imageURL = await getpetimg(pet.pet_id)
                pets[i] = { ...pet, image: imageURL }
                i++
            }
    
            setPets(pets)
        } catch (error) {
            console.error(error)
        }
    }

const Petprofile = ({ user }) => {
    const { trigger, setTrigger } = useMyContext();
    const [pets, setPets] = useState([]);
    const [imgurl,setimgurl] = useState('')
    const [petImages, setPetImages] = useState({});

    useEffect(() => {
        fetchData(user.user_id, setPets)
    }, [trigger])
    
    return (
        <Container>
            <Row className="align-items-center text-center">
                {pets?.map((item, index) => (
                    <Col xs={12} md={2} mr={4} key={index}>
                        <Link href={`/Account/${item.pet_id}`}>
                            <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', margin: 'auto' }}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    roundedCircle
                                    fluid
                                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}
                                />
                            </div>
                        </Link>
                        <h4>
                            <Link href={`/Account/${item.pet_id}`} style={{textDecoration:'none', color:'black'}}>
                                <p>{item.name}</p>
                            </Link>
                        </h4>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Petprofile;


