import React from 'react';
import { Helmet } from 'react-helmet';
import './CssFiles/TitlePage.css';
import { useNavigate } from 'react-router-dom';

const TitlePage = () => {
    const navigate = useNavigate();
    function TOS(){
        navigate('/TermsOfService')
    }
    return (
        <>
            <Helmet>
                <title>HOME PAGE</title>
            </Helmet>

            <div className='Windows95-Theme'>
                {/* Title Bar */}
                <div className="Window-Title-Bar">
                    <span className="Window-Title">Le�s_�o_��m�li�g.exe</span>
                    <div className="ButtonCon">
                        <button>-</button>
                        <button>X</button>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="TitlePageContent">
                    <div className="ContentCenter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '10vh', color:'white' }}>
                        <h1 className="MainTitle">Lets Go Gambling!!!</h1>
                        <button className="StartButton" onClick={TOS}>Continue?</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TitlePage;
