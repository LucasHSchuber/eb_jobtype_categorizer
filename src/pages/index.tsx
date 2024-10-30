import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";

// import toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'; 
// import { faInstagram, faGithub, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { API_URL } from '../assets/js/apiConfig'
console.log('import.meta.env', import.meta.env);
console.log('API_URL', API_URL);

import portalArray from '../assets/js/portals'
// console.log('portalArray', portalArray);


// Interfaces
interface JobType {
    uuid: string;
    name: string;
}
interface Category {
    jobtype_uuid: string;
    category_id: number;       
    category_name: string;     
    id: number;
    name: string;
}
interface Data {                  
    uuid: string;
    correspondingCategories: Category[] | null;
    name: string;
}


function Index() {
    // Define states
    const [selectedPortaluuid, setSelectedPortaluuid] = useState<string>("2dba368b-6205-11e1-b101-0025901d40ea");
    const [jobtypes, setJobtypes] = useState<JobType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [correspondingCategories, setCorrespondingCategories] = useState<Category[]>([]);
    // const [data, setData] = useState<Data[]>([]);
    const [updatedJobTypes, setUpdatedJobTypes] = useState<Data[]>([]);
    const [showAddCategoryButton, setShowAddCategoryButton] = useState<string>("");
    
    const [newCategoryId, setNewCategoryId] = useState("");
    const [newJobtypeId, setNewJobtypeId] = useState("");


 

    const fetchData = () => {
        const fetchJobTypes = async () => {
            try {
                const response = await axios.get("/api/index.php/rest/netlife/jobtypes", {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: {
                        portaluuid: selectedPortaluuid, 
                    },
                });
                console.log('response', response.data);
                if (response.status === 200){
                    setJobtypes(response.data.result)
                } else{
                    console.log('No response');
                }
            } catch (error) {
                console.log('error', error);
            }
        };
        
        const getMethod = async () => {
            try {
                const response = await axios.get(`${API_URL}api/jobtypesandcategories`, {
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
                    console.log('data', response.data.data);
                    setCorrespondingCategories(response.data.data)
                }
            } catch (error) {
                console.log('error', error);
            }
        }
        fetchJobTypes();
        getMethod();
    }
    useEffect(() => {   
        fetchData();
    }, [selectedPortaluuid]);


    useEffect(() => {
        const getMethod = async () => {
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
        getMethod();
    }, [selectedPortaluuid]);


    
    
    useEffect(() => {
        const newJobTypes: Data[] = jobtypes.map(jobtype => {
            // Use filter to get all matching categories
            const matchingCategories = correspondingCategories.filter(cat => jobtype.uuid === cat.jobtype_uuid);
    
            return {
                uuid: jobtype.uuid, 
                name: jobtype.name,   
                correspondingCategories: matchingCategories.length > 0 ? matchingCategories : null, 
            };
        });
    
        setUpdatedJobTypes(newJobTypes);
        console.log('updatedJobTypes', newJobTypes);
    }, [correspondingCategories, jobtypes]);
    
    




    const handleOnChangeSelect = (portaluuid: string) => {
      console.log('portaluuid', portaluuid);
      setSelectedPortaluuid(portaluuid);
    };

    const handleOnChangeTableSelect = (categoryid: string, jobtypeuuid: string) => {
        console.log('category_id', categoryid);
        console.log('jobtypeuuid', jobtypeuuid);
        setNewCategoryId(categoryid);
        setNewJobtypeId(jobtypeuuid)

        setShowAddCategoryButton(jobtypeuuid);
    };


    // METHOD POST to add new category to jobtype in neo_jobtypes table
    const addNewCategory = async () => {
        const data = {
            portaluuid: selectedPortaluuid,
            category_id: newCategoryId,
            jobtype_uuid: newJobtypeId
        }
      try {
        const response = await axios.post(`${API_URL}api/post/neo_jobtypes`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        console.log('response', response);
        if (response.status === 201) {
            toast.success("New category was assign to job type successfully!")
            fetchData();
        }
      } catch (error) {
        console.log('error adding new category to jobtype', error);
      }
    };
 




    return (
        <div className='wrapper'>

            <div className='mb-5 header-box'>
                <h1>Job Type Categorizer</h1>
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

            <div className='job-box'>
                <h4 className='mb-3'>Selected Portal: </h4>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Job Type
                                <input
                                    className='ml-2 search-box'
                                    placeholder='Search for Job Type..'
                                ></input>
                            </th>
                            <th>Categories</th>
                            <th>New Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedJobTypes && updatedJobTypes.map(item => (
                            <tr key={item.uuid} className='table-row'>
                                <td>
                                    <h1>{item.name}</h1>
                                </td>
                                <td>
                                    <div className='table-categories'>
                                        {item.correspondingCategories && item.correspondingCategories.length > 0 ? (
                                            <div>
                                                {item.correspondingCategories.map((cat, index) => (
                                                    <div className='d-flex'>
                                                        <h6 key={cat.category_id}>
                                                            {index+1}. {cat.category_name}
                                                        </h6>
                                                        <button 
                                                            title='Delete Category From Job Type'
                                                            className='delete-category-button'
                                                        >
                                                            <FontAwesomeIcon icon={faTrash}  />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span><em>None</em></span>
                                        )}
                                    </div>   
                                </td>
                                <td>
                                    <div className='mt-1 table-select-box'>
                                        <select
                                            className='table-select'
                                            onChange={(e) => handleOnChangeTableSelect(e.target.value, item.uuid)}
                                        >
                                            <option value="" disabled selected>
                                                Choose Category
                                            </option>
                                            {categories && categories.map(cat => (
                                                <option
                                                    value={cat.id}
                                                    key={cat.id}
                                                >
                                                    {cat.name}
                                                </option>    
                                            ))}
                                            
                                        </select>
                                        {showAddCategoryButton === item.uuid && (
                                            <button 
                                                className='addnewcategory-button'  
                                                title='Add New Category TO Job Type'
                                                onClick={() => addNewCategory()}    
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


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
                style={{ width: "500px", height: "50px", fontSize: "1rem", marginBottom: "3em", marginLeft: "1em" }}
                // toastClassName="custom-toast"
                // bodyClassName="custom-toast-body"
            />

        </div>
    );
}

export default Index;
