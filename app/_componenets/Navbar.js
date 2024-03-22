'use client'
import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { usePathname } from 'next/navigation'
import "./Navbar.css"


function Navbar_basic() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const pathname = usePathname();
    const parts = pathname.split('/'); // Split the pathname using '/' as the delimiter
    const realpathname = parts[1]; // Get the second part of the pathname


    return (
        <Navbar expand="lg" fixed="top" className="bg-body-tertiary, bg-success ">
            <Container className="text-center">
                <Button variant="success" onClick={handleShow}>
                    <img src="/hamburger.svg"></img>
                </Button>

                <Offcanvas show={show} onHide={handleClose} style={{ backgroundColor: '#33363F' }} s>
                    <Offcanvas.Header closeButton={false}>
                        <Offcanvas.Title></Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr className="my-4" style={{ borderColor: 'white' }}></hr>

                    <Offcanvas.Body >
                        <ul className="list-unstyled">
                           
                            <li className="mb-4 text-center">
                                <a href="../Account" className="menu">Account</a>
                            </li>
                            <li className="mb-4 text-center">
                                <a href="../TimeSettings" className="menu">Setting</a>
                            </li>
                            <li className="mb-4 text-center">
                                <a href="../Search" className="menu">Search</a>
                            </li>

                        </ul>

                    </Offcanvas.Body>
                </Offcanvas>
                <Navbar.Toggle />
                <div  >
                    <p className="pagename">{realpathname}</p>
                </div>

                <Dropdown as={ButtonGroup} className="justify-content-end">
                    <Button variant="success">Smart Howhan</Button>

                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">logout</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">logout</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    )

}
export default Navbar_basic;
