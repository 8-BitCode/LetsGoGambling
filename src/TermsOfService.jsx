import React, { useState, useEffect } from 'react';
import './CssFiles/TermsOfService.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage = () => {
    const [isFading, setIsFading] = useState(false);
    const navigate = useNavigate();
    const [displayedText, setDisplayedText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [inputEnabled, setInputEnabled] = useState(false); // To enable user input after the text is displayed

    const textContent = `\n DISCLAIMER: PLEASE READ BEFORE PROCEEDING\n\n
    This website is a SATIRICAL PARODY of gambling platforms. Its purpose is to critique and highlight the risks associated with gambling, not to promote or encourage it. Nothing on this site should be interpreted as an endorsement of gambling, nor should anything beyond this point be taken seriously.\n\n
    A Serious Note on Gambling:\n\nGambling carries significant financial and emotional risks. While often marketed as entertainment, it can lead to financial hardship, stress, and other negative consequences. The reality is that gambling establishments operate in a way that ensures they always profit in the long run, often at the expense of individuals who believe they can outplay the system. More than anything, this site aims to demonstrate just how unpredictable and unfavourable gambling can be.\n\n
    If you or someone you know struggles with gambling-related issues, professional resources and support systems are available. Seeking guidance from responsible gambling organizations can provide valuable assistance in making informed financial and personal decisions.\n\n
    By proceeding, you acknowledge that:\n\n- This website is entirely satirical. Any content, visuals, or mechanics presented here exist for comedic or critical purposes only.\n- There is no real gambling taking place. Nothing on this website involves actual monetary transactions or opportunities for financial gain or loss.\n- Gambling should be approached with extreme caution. The risks associated with it are well-documented, and this website does not encourage participation in any form of real gambling.\n- You understand that we are not responsible for any actions taken outside of this website. If you choose to engage in gambling elsewhere, we strongly encourage responsible decision-making and adherence to local laws and regulations.\n\n
    This website is meant to be an informative and humorous critique, not a gambling platform. If you are looking for responsible financial decisions, gambling is unlikely to be one of them.\n\n
    Thank you for taking the time to read this disclaimer. If you choose to continue, please do so with the understanding that this site is purely satirical.\n\n`

    useEffect(() => {
        let index = 0;
        const trimmedTextContent = textContent.trimStart();  // Remove leading whitespace/newlines
        setDisplayedText(''); // Ensure it starts as an empty string

        const interval = setInterval(() => {
            if (index < trimmedTextContent.length) {
                const nextChar = trimmedTextContent[index];
                if (nextChar !== undefined) {
                    setDisplayedText((prev) => prev + nextChar);
                }
                index++;
            } else {
                clearInterval(interval);
                setInputEnabled(true); // Enable input once all text has been displayed
            }
        }, 1);

        return () => clearInterval(interval);
    }, []);

    // Handle user input for "y" or "n"
    const handleChange = (e) => {
        if (inputEnabled) {
            setUserInput(e.target.value);
        }
    };

    // Handle Enter key press for confirmation
    const handleKeyDown = (e) => {
        if (inputEnabled && e.key === 'Enter') {
            if (userInput === 'y') {
                navigate('/UserEntry'); // Navigate to the user entry page
            } else if (userInput === 'n') {
                navigate('/'); // Redirect them away (you can customize this route)
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [inputEnabled, userInput]);

    return (
        <>
            <Helmet>
                <title>Terms Of Service</title>
            </Helmet>

            <div className='TOS-Container'>
                <div className={`fade-overlay ${isFading ? 'active' : ''}`}></div>
                <pre>
                    {displayedText}
                </pre>

                {/* Displaying the prompt after the text is shown */}
                {inputEnabled && (
                    <div className="input-prompt-container">
                        <span className="prompt-text">
                            Do you want to continue [y/n]?:
                        </span>
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            maxLength="1"
                            className="input-field"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default TermsOfServicePage;
