import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import './CssFiles/TitlePage.css';
import { useNavigate } from 'react-router-dom';

const TitlePage = () => {
    const navigate = useNavigate();
    const [isGlitching, setIsGlitching] = useState(false);

    function TOS() {
        setIsGlitching(true);
        setTimeout(() => {
            navigate('/TermsOfService');
        }, 500); // 1.5 seconds of glitch effect
    }

    return (
        <>
            <Helmet>
                <title>MALWARE DETECTED</title>
            </Helmet>

            <div className={`Windows95-Theme ${isGlitching ? 'glitch' : ''}`}>
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
                        <h1 className="MainTitle">Let Goo Gamblingg!!!</h1>
                        <button className="StartButton" onClick={TOS}>Continue? (100% safe!!!)</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TitlePage;
