import Header from "./Landing/Header";
import Main from "./Landing/Main";
import background from "./assets/background_1.png";

import { useCallback, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const Landing = () => {

    const [active, setActive] = useState("");
    const onChange = useCallback((act) => {
        setActive(act);
    }, [setActive]);


    useEffect(() => {

    }, []);

    return (
        <div 
            style={{ 
                backgroundImage: `linear-gradient(rgba(0, 100, 0, 0.3), rgba(0, 100, 0, 0.3)), url(${background})`,
                minHeight: '450vh', // Ensure it covers the entire viewport height
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',         
            }} 
            className="flex flex-col w-full sm:w-full md:w-full lg:w-full xl:w-full"
        >
            <Header onChange={onChange}/>
            <Main active={active} />
            
        </div>
    );
}

Main.propTypes = {
    active: PropTypes.string.isRequired,
};

export default Landing;
