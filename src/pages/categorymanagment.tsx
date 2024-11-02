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

// import loader
import { Oval } from 'react-loader-spinner';  

// import components
import Sidemenu  from '../components/sidemenu';
import ShowCategoryModal from '../components/showCategoryModal';
import ShowEditCategoryModal from '../components/showEditModal';

// import ENVIROMENTAL VAR
import { API_URL } from '../assets/js/apiConfig'
const ENV = import.meta.env;
console.log('ENV', ENV);
console.log('API_URL', API_URL);


import portalArray from '../assets/js/portals'
import getToken from '../assets/js/fetchToken'
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
    const [loading, setLoading] = useState(true);
    const [TokenValidation, setTokenValidation] = useState<boolean | null>(null);

    const [selectedPortaluuid, setSelectedPortaluuid] = useState<string>("2dba368b-6205-11e1-b101-0025901d40ea");
    const [selectedPortalName, setSelectedPortalName] = useState<string>("Expressbild");
    const [categories, setCategories] = useState<Category[]>([]);

    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);

    const [editCategoryArray, setEditCategoryArray] = useState<EditCategory | null>(null);



   // -------------- FETCHING TOKEN ------------------
    // fetching token from external ts file
    const token = getToken();
    
    useEffect(() => {
      console.log('TokenValidation', TokenValidation);
    }, [TokenValidation]);

    useEffect(() => {
        const getToken = async () => {
          if (token) {
            const validatedToken = await validateToken(token); 
            // setValidationResult(validatedToken);
            console.log('validatedToken', validatedToken);
            if (validatedToken !== null) {
                console.log("TOKEN VALID");
                setTokenValidation(true)
            }else {
                setTokenValidation(false)
            }
          }
        };  
    getToken(); 
    }, [token]); 
    // Validate token 
    const validateToken = async (token: string) => {
        try {
            const response = await axios.get(
            `/api/index.php/rest/auth/validate_token/${token}`,
            {
                headers: {
                'Content-Type': 'application/json',
                },
            }
            );
            console.log('Token response:', response.data.result);
            return response.data.result; 
        } catch (error) {
            console.error('Error validating token:', error);
            return null;
        }
    };


    // METHOD to fetch categories from db
    const fetchCategories = async () => {
        setLoading(true);
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
                setLoading(false);
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    useEffect(() => {   
        if (TokenValidation){
            fetchCategories();
            console.log('fetching data');
        } else if (TokenValidation == false && TokenValidation !== null) {
            console.log("TOKEN MISSING OR INVALID");
            toast.error("Token is missing or invalid")
            setLoading(false);
        }
    }, [selectedPortaluuid, TokenValidation]);


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



    // If missing token SHOW:  
    if (TokenValidation === false) {
        return (
            <div className='wrapper' >
            <h2 style={{ color: '#ff4d4d', marginBottom: '10px' }}>Missing or Invalid Token</h2>
            <h5 style={{ color: '#666', marginBottom: '20px' }}>
                Please contact IT if the issue persists.
            </h5>
            <button 
                onClick={() => window.location.reload()} 
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Refresh Page
            </button>
        </div>
        );
    }




    return (
    <div>
        <div className='category-header-wrapper'>
            <div className='mb-5 header-box'>
                <h1>Category Managment</h1>
                <h5>Manage the categories and get an overview of the exisiting categories in the different portals</h5>
            </div>

            {/* Portaluuid Select box */}
            <div className='select-wrapper mb-5'>
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
                    <table className="cm-table">
                        <thead>
                            <tr>
                                <th scope="col">Category Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                 <tr>
                                    <td style={{ 
                                        textAlign: 'center', 
                                        height: '100px', 
                                        width: '200%',
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center' 
                                    }}>
                                        <Oval
                                            height={50}
                                            width={50}
                                            color="#ffcfcb"
                                            visible={true}
                                            ariaLabel="loading-indicator"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                categories && categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>{cat.name}</td>
                                    <td>
                                        <button 
                                            title='Edit Category'
                                            className='edit-categoory-button'
                                            onClick={() => handelEditCategory(cat.name, cat.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button 
                                            title='Delete Category'
                                            className='ml-2 delete-cat-button'
                                            onClick={() => deleteCategory(cat.id)} 
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
               
                <button onClick={() => setShowNewCategoryModal(!showNewCategoryModal)} className='mt-3 addnewcategory-button'><FontAwesomeIcon icon={faPlus} /> Add New Category to {selectedPortalName}</button>
            
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
