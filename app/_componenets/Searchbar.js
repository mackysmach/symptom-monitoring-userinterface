'use client'
import { Form, Button } from "react-bootstrap";
import './Searchbar.css';
import { useMyContext } from "../_Handlers/Mycontext";
import { useState } from "react";

function Searchbar() {
    const { sharedState, setSharedState } = useMyContext();

    const handleInputChange = (e) => {
        setSharedState(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSharedState(e.target[0].value)
        console.log('Form submitted!');
    };
    var createAlertDialog = function () {
        var dialog = document.getElementById('my-alert-dialog');

        if (dialog) {
            dialog.show();
        } else {
            ons.createElement('alert-dialog.html', { append: true })
                .then(function (dialog) {
                    dialog.show();
                });
        }
    };

    var hideAlertDialog = function () {
        document
            .getElementById('my-alert-dialog')
            .hide();
    };

    var notify = function () {
        ons.notification.alert('This dialog was created with ons.notification');
    };
    const [data, setData] = useState([]);

   

    return (
        <>
            <Form className="searchbar" onSubmit={handleSubmit}>
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    // value={sharedState} // Controlled component: value from sharedState
                    // onChange={handleInputChange} // Handle input change
                    onSubmit={handleSubmit}
                />
                <Button variant="success" type="submit">
                    Search
                </Button>
            </Form>
           
        </>




    );
}

export default Searchbar;
