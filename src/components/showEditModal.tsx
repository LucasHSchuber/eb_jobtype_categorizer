import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

// import fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';


import { API_URL } from '../assets/js/apiConfig'
console.log('API_URL', API_URL);


interface ShowCategoryModalProps {
    show: boolean;
    onClose: () => void;
    title: string;
    categoriesArray: string[];
    portaluuid: string;
    onSuccess: () => void;
    editCategoryArray: any; 
}

const ShowEditCategoryModal: React.FC<ShowCategoryModalProps> = ({ show, onClose, onSuccess, editCategoryArray, title, categoriesArray, portaluuid }) => {
    // define states
    const [newCategoryName, setNewCategoryName] = useState("");
    const [errorBorder, setErrorBorder] = useState(false);
    const [errorCategoryExists, setErrorCategoryExists] = useState(false);

    console.log('categoriesArray', categoriesArray);
    console.log('editCategoryArray', editCategoryArray);

    // handle input 
    const handleInput = (e: string) => {
        console.log('categoryName', e);
        setErrorBorder(false);
        setNewCategoryName(e);
    };
    
    // METHOD to add new category
    const EditCategory = async () => {
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
      const confirm = window.confirm("Are you sure you want to rename category to '" + newCategoryName + "'?")
      if (confirm){
        //step 1 - make sure no category with portaluuid already exists

        //step 2 - add new category to neo_jobtypes_category
        const data = {
            id: editCategoryArray.id,
            portaluuid: portaluuid,
            name: newCategoryName
        }
        console.log('data', data);
        try {
            const response = await axios.put(`${API_URL}api/put/neo_jobtypes_categories`, data, {
                headers: {
                    "Content-type": "Application/json"
                }
            })
            console.log('response', response);
            if (response.status === 200){
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
                            <h6      className="form-label">Edit Category Name</h6>
                            <div>
                                <input type="text" className={`modal-input ${errorBorder ? "error-border" : ""}`} id="categoryName" placeholder='New category name' defaultValue={editCategoryArray.name} onChange={(e) => handleInput(e.target.value)} />
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
                    <button className='editcategory-modal-button' onClick={() => EditCategory()}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ShowEditCategoryModal;
