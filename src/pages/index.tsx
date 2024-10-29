import React from 'react';
import { useState, useEffect } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { } from '@fortawesome/free-solid-svg-icons';
// import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'; 
// import { faInstagram, faGithub, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';



function Index() {
  // Define states
  const [jobtypes, setJobtypes] = useState([]);

  // Fetching all job types from REST API based on portaluuid
  useEffect(() => {
    const fetchJobTypes = async () => {
        try {
            const response = await axios.get("/api/index.php/rest/netlife/jobtypes", {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    portaluuid: "2dba368b-6205-11e1-b101-0025901d40ea", 
                },
            });
            console.log('response', response.data);
            if (response.status === 200){
                setJobtypes(response.data)
            } else{
                console.log('No response');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    fetchJobTypes();
}, []);


useEffect(() => {
  console.log('jobtypes', jobtypes);
}, [jobtypes]);

  return (

    <div className='wrapper'>
        <div className='header-box'>
            <h1>Job Type Categorizer</h1>
        </div>
        <h1>index</h1>
    </div>
 
  );
}

export default Index;
