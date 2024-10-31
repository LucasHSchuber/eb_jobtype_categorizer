import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";

// import toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'; 
// import { faInstagram, faGithub, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

// import components
import Sidemenu  from '../components/sidemenu';
import ShowCategoryModal from '../components/showCategoryModal';
import ShowEditCategoryModal from '../components/showEditModal';

import { API_URL } from '../assets/js/apiConfig'
console.log('import.meta.env', import.meta.env);
console.log('API_URL', API_URL);

import portalArray from '../assets/js/portals'
// console.log('portalArray', portalArray);


// Interfaces
// interface JobType {
//     uuid: string;
//     name: string;
// }
interface Category {
    jobtype_uuid: string;
    category_id: number;       
    category_name: string;     
    id: number;
    name: string;
}
interface EditCategory {    
    id: number;
    name: string;
    selectedPortaluuid: string;
}
// interface Data {                  
//     uuid: string;
//     correspondingCategories: Category[] | null;
//     name: string;
// }


function Categorymanagment() {
    // Define states
    const [selectedPortaluuid, setSelectedPortaluuid] = useState<string>("2dba368b-6205-11e1-b101-0025901d40ea");
    const [selectedPortalName, setSelectedPortalName] = useState<string>("Expressbild");
    const [categories, setCategories] = useState<Category[]>([]);

    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);

    const [editCategoryArray, setEditCategoryArray] = useState<EditCategory | null>(null);


    const closeModal = () => {
        setShowNewCategoryModal(false);
        setShowEditCategoryModal(false);
    } 

    const handleSuccess = () => {
        toast.success("New category created successfully!"); 
        fetchCategories();
    };
    const handleEditSuccess = () => {
        toast.success("New category updated successfully!"); 
        fetchCategories();
    };

    // METHOD DELETE to delete category from neo_jobtypes_categories table
    const deleteCategory = async (categoryid: number) => {
        console.log('categoryid', categoryid);
        console.log('selectedPortaluuid', selectedPortaluuid);
        const confirm = window.confirm("Are your sure you want to delete this category?")
        if (confirm){
              try {
                  const deleteResponse = await axios.delete(`${API_URL}api/delete/neo_jobtypes_categories`, {
                      headers: {
                          "Content-type": "Application/json",
                      },
                      params: {
                          portaluuid: selectedPortaluuid,
                          id: categoryid
                      }
                  })
                  console.log('deleteResponse', deleteResponse);
                  if (deleteResponse.status === 200){
                      toast.success("Category was deleted successfully!")
                      fetchCategories();
                  }
              } catch (error) {
                  console.log('error deleting category: ', error);
              }
          }  
      };


    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}api/neo_jobtypes_categories`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    portaluuid: selectedPortaluuid
                }
            }
            )
            // console.log('response', response);
            if (response.status === 200){
                console.log('Categories:', response.data.data);
                setCategories(response.data.data)
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    useEffect(() => {   
        fetchCategories();
    }, [selectedPortaluuid]);



    const handelEditCategory = (name: string, id: number) => {
      setShowEditCategoryModal(!showEditCategoryModal)
      setEditCategoryArray({ name, id, selectedPortaluuid });
    };


    const handleOnChangeSelect = (portaluuid: string) => {
        console.log('portaluuid', portaluuid);
        const portalObject = portalArray.find(p => p.portaluuid === portaluuid);
        const portalname = portalObject ? portalObject.name : ""
        console.log('portalname', portalname);

        setSelectedPortaluuid(portaluuid);
        setSelectedPortalName(portalname);
      };



    return (
    <div>
        <div className='category-header-wrapper'>
            <div className='mb-5 header-box'>
                <h1>Category Managment</h1>
            </div>

            {/* Portaluuid Select box */}
            <div className='mb-5'>
                <select
                    className='select'
                    onChange={(e) => handleOnChangeSelect(e.target.value)}
                >
                    {portalArray && portalArray.map(item => (
                        <option
                            value={item.portaluuid}
                            className='select-option'
                            key={item.portaluuid}
                        >
                            {item.name}
                        </option>    
                    ))}
                    
                </select>
            </div>
        </div>

        <div className='wrapper'>           
            <div className='job-box'>
                <div className='mb-5 selected-portal-box'>
                    <h4>{selectedPortalName} </h4>
                </div>
                <h5>Existing Categories:</h5>
                <div className='categories-box'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Category Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories && categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>{cat.name}</td>
                                    <td>
                                        <button 
                                            title='Delete Category'
                                            className='mr-2 delete-cat-button'
                                            onClick={() => deleteCategory(cat.id)} 
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button 
                                            title='Edit Category'
                                            className='edit-categoory-button'
                                            onClick={() => handelEditCategory(cat.name, cat.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => setShowNewCategoryModal(!showNewCategoryModal)} className='addnewcategory-button'><FontAwesomeIcon icon={faPlus} /> Add New Category to {selectedPortalName}</button>
            </div>




            <Sidemenu />
            {showNewCategoryModal && (
                <ShowCategoryModal show={showNewCategoryModal} onClose={closeModal} categoriesArray={categories.map(category => category.name)} portaluuid={selectedPortaluuid}  onSuccess={handleSuccess} title="Add New Category" />
            )}
             {showEditCategoryModal && (
                <ShowEditCategoryModal show={showEditCategoryModal} onClose={closeModal} editCategoryArray={editCategoryArray} categoriesArray={categories.map(category => category.name)} portaluuid={selectedPortaluuid}  onSuccess={handleEditSuccess} title="Edit Category" />
            )}
            

            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" // light, dark, colored
                style={{ width: "500px", height: "50px", fontSize: "1.1rem", marginBottom: "3em", marginLeft: "1em" }}
                // toastClassName="custom-toast"
                // bodyClassName="custom-toast-body"
            />

        </div>
    </div>   
    );
}

export default Categorymanagment;
