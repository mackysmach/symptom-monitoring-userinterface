'use client'

import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import { search } from '../_Handlers/Search';
import { useMyContext } from '../_Handlers/Mycontext';

const SearchCard = () => {
    const [items, setItems] = useState({ data: [], total: 0 });
    const { sharedState } = useMyContext();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.total / 10);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await search(currentPage, sharedState);
                if (data) {
                    setItems(data);
                }
                else {
                    setItems({ data: [], total: 0 }); 
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setItems({ data: [], total: 0 }); 

            }
        };

        fetchData();
    }, [sharedState, currentPage]);

    return (
        <>
            {items && items.data && items.data.map(item => (
                <Card key={item.id} className="mb-3 w-80">
                    <Card.Body>
                        {item.trade_name && <Card.Title>{item.trade_name}</Card.Title>}
                        {item.drug_name && <Card.Subtitle className="mb-2 text-muted">{item.drug_name}</Card.Subtitle>}
                        {item.title && <Card.Title>{item.title}</Card.Title>}
                        {item.description && <Card.Text>{item.description}</Card.Text>}
                        {item.preparation && <Card.Text><strong>Preparation:</strong> {item.preparation}</Card.Text>}
                        {item.caution && <Card.Text><strong>Caution:</strong> {item.caution}</Card.Text>}
                        {item.video_url && (
                            <div>
                                <Card.Link href={item.video_url} target="_blank" rel="noopener noreferrer">{item.video_url}</Card.Link>
                                <div style={{ marginTop: '10px' }}>
                                    <iframe
                                        src={item.video_url}
                                        title="URL Preview"
                                        width="50%"
                                        height="200px"
                                        frameBorder="0"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}                        
                        <Card.Footer className="text-muted mt-4">
                            <small>Created At: {new Date(item.created_at).toLocaleString()}</small><br />
                            <small>Updated At: {new Date(item.updated_at).toLocaleString()}</small>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            ))}
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
};

export default SearchCard;
