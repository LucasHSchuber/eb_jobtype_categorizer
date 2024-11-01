import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

// import fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


import { API_URL } from '../assets/js/apiConfig'
console.log('API_URL', API_URL);


interface ShowCategoryModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    categoriesArray: string[];
    portaluuid: string;
    onSuccess: () => void; 
}

const ShowCategoryModal: React.FC<ShowCategoryModalProps> = ({ show, onClose, onSuccess, title, categoriesArray, portaluuid }) => {
    // define states
    const [newCategoryName, setNewCategoryName] = useState("");
    const [errorBorder, setErrorBorder] = useState(false);
    const [errorCategoryExists, setErrorCategoryExists] = useState(false);

    console.log('categoriesArray', categoriesArray);

    // handle input 
    const handleInput = (categoryName: string) => {
        console.log('categoryName', categoryName);
        setErrorBorder(false);
        setNewCategoryName(categoryName);
    };
    
    // METHOD to add new category
    const addCategory = async () => {
      console.log('newCategoryName', newCategoryName);
      if (!newCategoryName) {
        setErrorBorder(true);
        return;
      }
      if (categoriesArray.map(cat => cat.toLocaleLowerCase()).includes(newCategoryName.toLocaleLowerCase())) {
        console.log('Category already exists');
        setErrorCategoryExists(true);
        return;
      }
      const confirm = window.confirm("Are you sure you want to add new category '" + newCategoryName + "'?")
      if (confirm){
        //step 1 - make sure no category with portaluuid already exists

        //step 2 - add new category to neo_jobtypes_category
        const data = {
            portaluuid: portaluuid,
            name: newCategoryName
        }
        try {
            const response = await axios.post(`${API_URL}api/post/neo_jobtypes_categories`, data, {
                headers: {
                    "Content-type": "Application/json"
                }
            })
            console.log('response', response);
            if (response.status === 201){
                onSuccess();
                onClose()
            }
        } catch (error) {
            console.log('error', error);
        }
      }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <div className='newcategory-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <h4></h4>
                    <form>
                        <div className="mb-3">
                            <h6 className="form-label">New Category Name</h6>
                            <div>
                                <input type="text" className={`modal-input ${errorBorder ? "error-border" : ""}`} id="categoryName" placeholder='New category name' value={newCategoryName} onChange={(e) => handleInput(e.target.value)} />
                                {errorCategoryExists && (
                                    <h6 className='mt-3' style={{ color: "red" }}>A category named '{newCategoryName}' already exists in this portal.</h6>
                                )}
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <div className='mx-3 my-3 d-flex justify-content-center'>
                    <button className='mr-2 close-modal-button' onClick={onClose}>
                        Close
                    </button>
                    <button className='addcategory-modal-button' onClick={() => addCategory()}>
                        <FontAwesomeIcon icon={faPlus} /> Add Category
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShowCategoryModal;
