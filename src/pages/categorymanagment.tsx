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

// import components
import Sidemenu  from '../components/sidemenu';

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


function Categorymanagment() {
    // Define states
    const [selectedPortaluuid, setSelectedPortaluuid] = useState<string>("2dba368b-6205-11e1-b101-0025901d40ea");
    const [categories, setCategories] = useState<Category[]>([]);


    

    
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






    const handleOnChangeSelect = (portaluuid: string) => {
      console.log('portaluuid', portaluuid);
      setSelectedPortaluuid(portaluuid);
    };


    // METHOD POST to add new category to jobtype in neo_jobtypes table
    const addNewCategory = async () => {
        const data = {
            portaluuid: selectedPortaluuid,
            // category_id: newCategoryId,
            // jobtype_uuid: newJobtypeId
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
            // fetchData();
        }
      } catch (error) {
        console.log('error adding new category to jobtype', error);
      }
    };
 


    return (
        <div className='wrapper'>

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


            <Sidemenu />
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

export default Categorymanagment;
