// header.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons';

const Sidemenu: React.FC = () => {
    // Define state
    const [link, setLink] = useState("");

    const navigate = useNavigate();


        // Find correct link when loaded 
        useEffect(() => {
            const currentPath = window.location.hash;
            console.log('window.location.hash', window.location.hash);
            const initialLink = currentPath === '#/' ? 'Jobtypecategorizer' : currentPath.charAt(0).toUpperCase() + currentPath.slice(1); 
            console.log('initialLink', initialLink);
            const pop = initialLink.split('/').pop() || 'Jobtypecategorizer';
            console.log('pop', pop);
            // Capitalize the first letter of pop
            const capitalizedPop = pop.charAt(0).toUpperCase() + pop.slice(1);
            console.log('capitalizedPop', capitalizedPop);
            setLink(capitalizedPop);
        }, []);

    const handleNavigation = (path: string, label: string) => {
        console.log('label', label);
        setLink(label);
        navigate(path);
    }; // Closing the function properly here

    return (
        <div className="sidemenu">
            {/* Navigation Links */}
            <h4 className='mb-4' style={{ fontWeight: "700", marginLeft: "1.75em", textDecoration: "underline" }}>Menu</h4>
            <div className='link-box'>
                <div>
                    <button
                        onClick={() => handleNavigation("/", "Jobtypecategorizer")}
                        className={` link-button  ${link === "Jobtypecategorizer" ? "active" : ""}`}
                    >
                        Job Type Categorizer
                    </button>
                </div>
            </div>
            <div className='link-box'>
                <div>
                    <button
                        onClick={() => handleNavigation("/categorymanagment", "Categorymanagment")}
                        className={` link-button  ${link === "Categorymanagment" ? "active" : ""}`}
                    >
                        Category Managment
                    </button>
                </div>
            </div>

            
        </div>
    );
}

export default Sidemenu;
