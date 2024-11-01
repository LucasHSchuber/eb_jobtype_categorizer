import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";

// import toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'; 
// import { faInstagram, faGithub, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

// import loader
import { Oval } from 'react-loader-spinner';  

// import components
import Sidemenu  from '../components/sidemenu';

// import ENVIROMENTAL VAR
import { API_URL } from '../assets/js/apiConfig'
// const ENV = import.meta.env;
// console.log('ENV', ENV);
// console.log('API_URL', API_URL);

// import external ts files
import portalArray from '../assets/js/portals'
import getToken from '../assets/js/fetchToken'
// console.log('getToken', getToken);


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
    const [loading, setLoading] = useState(true);
    // const [validationResult, setValidationResult] = useState<string | null>(null);
    const [TokenValidation, setTokenValidation] = useState<boolean | null>(null);
    // const [token, setToken] = useState("");
    
    const [selectedPortaluuid, setSelectedPortaluuid] = useState<string>("2dba368b-6205-11e1-b101-0025901d40ea");
    const [selectedPortalName, setSelectedPortalName] = useState<string>("Expressbild");
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
    const [jobtypes, setJobtypes] = useState<JobType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [correspondingCategories, setCorrespondingCategories] = useState<Category[]>([]);
    // const [data, setData] = useState<Data[]>([]);
    const [updatedJobTypes, setUpdatedJobTypes] = useState<Data[]>([]);
    const [showAddCategoryButton, setShowAddCategoryButton] = useState<string>("");
    
    const [newCategoryId, setNewCategoryId] = useState("");
    const [newJobtypeId, setNewJobtypeId] = useState("");

    const [searchString, setSearchString] = useState<string>("");

    
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


 
    // METHOD to fetch data
    const fetchData = () => {
        // if (!TokenValidation){
        //     console.log("TOKEN MISSING OR INVALID");
        //     toast.error("Token is missing or invalid")
        //     setLoading(false);
        //     return;
        // }
        setLoading(true);
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
            if (TokenValidation){
                fetchData();
                console.log('fetching data');
            } else if (TokenValidation == false && TokenValidation !== null) {
                console.log("TOKEN MISSING OR INVALID");
                toast.error("Token is missing or invalid")
                setLoading(false);
            }
    }, [selectedPortaluuid, TokenValidation]);


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

        if (TokenValidation){
            getMethod();
            console.log('fetching data');
        } else if (TokenValidation == false && TokenValidation !== null) {
            console.log("TOKEN MISSING OR INVALID");
            setLoading(false);
        }        
    }, [selectedPortaluuid, TokenValidation]);





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
    // Shut down loader when all data is fetched and ready
    useEffect(() => {
       if (updatedJobTypes.length > 0){
        setLoading(false)
       }
    }, [updatedJobTypes]);



    const handleOnChangeSelect = (portaluuid: string) => {
      console.log('portaluuid', portaluuid);
      const portalObject = portalArray.find(p => p.portaluuid === portaluuid);
      const portalname = portalObject ? portalObject.name : ""
      console.log('portalname', portalname);
      setShowAddCategoryButton("");
      setSelectedPortaluuid(portaluuid);
      setSelectedPortalName(portalname);
    };

    const handleOnChangeTableSelect = (categoryid: string, jobtypeuuid: string) => {
        console.log('category_id', categoryid);
        console.log('jobtypeuuid', jobtypeuuid);
        setNewCategoryId(categoryid);
        setNewJobtypeId(jobtypeuuid)
        const catObject = categories.find(c => c.id === Number(categoryid))
        console.log('catObject', catObject);
        const categoryName = catObject ? catObject.name : "";
        setSelectedCategoryName(categoryName);
        setShowAddCategoryButton(jobtypeuuid);
    };


    // METHOD POST to add new category to jobtype in neo_jobtypes table
    const addNewCategory = async () => {
        const confirm = window.confirm("Are your sure you want to assign category '" + selectedCategoryName + "' to job type?")
        if (confirm){
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
        }
    };

    // METHOD DELETE to add delete category from jobtype in neo_jobtypes table
    const deleteCategoryFromJobtype = async (jobtypeUuid: string, categoryid: number) => {
      console.log('jobtypeUuid', jobtypeUuid);
      console.log('categoryid', categoryid);
      const confirm = window.confirm("Are your sure you want to delete the category from job type?")
      if (confirm){
            try {
                const deleteResponse = await axios.delete(`${API_URL}api/delete/neo_jobtypes`, {
                    headers: {
                        "Content-type": "Application/json",
                    },
                    params: {
                        jobtype_uuid: jobtypeUuid,
                        category_id: categoryid
                    }
                })
                console.log('deleteResponse', deleteResponse);
                if (deleteResponse.status === 200){
                    toast.success("Category was deleted from job type successfully!")
                    fetchData();
                }
            } catch (error) {
                console.log('error deleting category from job type: ', error);
            }
        }  
    };
 

    const handleSearchInput = (search: string) => {
      console.log('search', search);
      setSearchString(search);
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

        <div className='jobtype-header-wrapper'>
            <div className='mb-5 header-box'>
                <h1>Job Type Categorizer</h1>
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
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Job Type
                                <input
                                    className='ml-2 search-box'
                                    placeholder='Search for Job Type..'
                                    // value={searchString}
                                    onChange={(e)=>handleSearchInput(e.target.value)}
                                ></input>
                            </th>
                            <th>Categories</th>
                            <th>New Category</th>
                        </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td style={{ 
                                textAlign: 'center', 
                                height: '100px', 
                                width: '300%',
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }}>
                                <Oval
                                    height={50}
                                    width={50}
                                    color="#cbd1ff"
                                    visible={true}
                                    ariaLabel="loading-indicator"
                                />
                            </td>
                        </tr>
                    ) : updatedJobTypes.length > 0 ? (
                        updatedJobTypes.filter(item => new RegExp(searchString, 'i').test(item.name))
                        .map(item => (
                            <tr key={item.uuid} className="table-row">
                                <td>
                                    <h1>{item.name}</h1>
                                </td>
                                <td>
                                    <div className="table-categories">
                                        {item.correspondingCategories && item.correspondingCategories.length > 0 ? (
                                            item.correspondingCategories.map((cat, index) => (
                                                <div className="table-categories-box d-flex justify-content-between" key={cat.category_id}>
                                                    <h6>
                                                        {index + 1}. {cat.category_name}
                                                    </h6>
                                                    <button title="Delete Category From Job Type" className="delete-category-button" onClick={() => deleteCategoryFromJobtype(item.uuid, cat.category_id) }>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <span><em>None</em></span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="mt-1 table-select-box">
                                        <select className="table-select" onChange={(e) => handleOnChangeTableSelect(e.target.value, item.uuid)}>
                                            <option value="" disabled selected>
                                                Assign New Category
                                            </option>
                                            {categories.map(cat => (
                                                <option value={cat.id} key={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {showAddCategoryButton === item.uuid && (
                                            <button
                                                className="addcategory-button"
                                                title="Add New Category To Job Type"
                                                onClick={() => addNewCategory()}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr >
                            <td colSpan={3}>
                                No Data
                            </td>
                      </tr>
                    )}
                    </tbody>
                </table>
            </div>


            <Sidemenu />
            <ToastContainer
                position="bottom-left"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
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

export default Index;
