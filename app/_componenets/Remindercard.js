import { Table, Modal, Button, Card, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import './Remindercard.css';
import { useMyContext } from "../_Handlers/Mycontext";
import Pagination from 'react-bootstrap/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import { getallremindder } from '@/app/_Handlers/Getallreminder';
import { deletereminder } from "../_Handlers/Deletereminder";
import { getreminder } from '../_Handlers/Getreminder';
import EditReminderModal from "./Editremindermodal";

function Remindercard(petid) {
    const [items, setItems] = useState([]);
    const { sharedState } = useMyContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [reminderid, setreminderid] = useState(null);
    const [reminderdata,setreminderdata]= useState(null);
    const [remindertype, setremindertype] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteitemtype,setdeleteitemtype] =useState(null);
    const { trigger, setTrigger } = useMyContext();

    const totalPages = Math.ceil(items.total / 10);

    const handleDelete = async () => {
        if (deleteItemId&&deleteitemtype) {
            const response= await deletereminder(deleteItemId,deleteitemtype);
            console.log(response)
            toast.success(response.message, {
                autoClose: 800,
                onClose: () => {
                    setTimeout(() => {
                        console.log(trigger);
                        setTrigger(prev => prev + 1);
                    }, 1100);
                },
            });
            setDeleteItemId(null);
            setShowDeleteModal(false);
        }
    };

    const handleShowDeleteModal = (itemId) => {
        setDeleteItemId(itemId.reminder_id);
        setdeleteitemtype(itemId.type)
        setShowDeleteModal(true);
        console.log(itemId)
    };

    const handleHideDeleteModal = () => {
        setDeleteItemId(null);
        setShowDeleteModal(false);
    };

    const handlePageChange = (page) => {
        console.log(`Page changed to: ${page}`);
        setCurrentPage(page);
    };

    const handleEdit = async(reminderdata) => {
        setreminderid(reminderdata.reminder_id);
        setremindertype(reminderdata.type)
        setreminderdata(await getreminder(reminderdata.reminder_id,reminderdata.type));
        setShowEditModal(true);
    };

    useEffect(() => {
        getallremindder(petid.petid).then(data => {
            if (Array.isArray(data)) { // Check if data is an array
                setItems(data);
            } else {
                setItems([]); // Set pets to an empty array if data is not an array
            }
        });
    }, [sharedState, currentPage, trigger]);

    return (
        <>
            <div style={{ borderRadius: '10px', overflow: 'scroll' }}>
                <ToastContainer />
            </div>

            {items.map((item, index) => (
                <Card key={index} className="mb-3">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <Card.Title>Reminder ID: {item.reminder_id}</Card.Title>
                            <Dropdown>
                                <Dropdown.Toggle variant="transparent" id={`dropdown-${index}`}>
                                    {/* <i className="fas fa-ellipsis-v"></i> */}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleEdit(item)}>Edit Reminder</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleShowDeleteModal(item)}>Delete Reminder</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Card.Text>
                            Pet ID: {item.pet_id}<br />
                            Reminder Type: {item.type}<br />
                            Drug Name: {item.drug_name}<br />
                            Drug Usage: {item.drug_usage}<br />
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}

            {reminderid &&remindertype&&reminderdata&& (
                <EditReminderModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    reminder_id={reminderid}
                    type={remindertype}
                    reminderdata={reminderdata}

                />
            )}
            <Modal show={showDeleteModal} onHide={handleHideDeleteModal} centered>
                <Modal.Header className="text-center p-3">
                    <Modal.Title className="mx-auto">Delete Reminder Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-5">
                    Are you sure you want to delete reminder?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleHideDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Pagination variant="success">
                <Pagination.First onClick={() => handlePageChange(1)} />
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} />
            </Pagination>
        </>
    );
}

export default Remindercard;
