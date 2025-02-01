import React from 'react';
import './CssFiles/TermsOfService.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage = () => {
    const navigate = useNavigate();

    const goToUserEntry = () => {
        navigate('/UserEntry');
    };

    return(
        <>
            <Helmet>
                <title>Terms Of Service</title>
            </Helmet>

            <div className="TOS-Container">
                <h1>DISCLAIMER: PLEASE READ BEFORE PROCEEDING</h1>

                <p>This website is a <span className="important">satirical parody</span> of gambling platforms. Its purpose is to critique and highlight the risks associated with gambling, not to promote or encourage it. Nothing on this site should be interpreted as an endorsement of gambling, nor should anything beyond this point be taken seriously.</p>

                <h2>A Serious Note on Gambling</h2>
                <p>Gambling carries significant financial and emotional risks. While often marketed as entertainment, it can lead to financial hardship, stress, and other negative consequences. <span className="important">The reality is that gambling establishments operate in a way that ensures they always profit in the long run, often at the expense of individuals who believe they can outplay the system.</span> More than anything, this site aims to demonstrate just how unpredictable and unfavorable gambling can be.</p>

                <p>If you or someone you know struggles with gambling-related issues, professional resources and support systems are available. Seeking guidance from responsible gambling organizations can provide valuable assistance in making informed financial and personal decisions.</p>

                <h2>By proceeding, you acknowledge that:</h2>
                <ul>
                    <li><span className="important">This website is entirely satirical.</span> Any content, visuals, or mechanics presented here exist for comedic or critical purposes only.</li>
                    <li><span className="important">There is no real gambling taking place.</span> Nothing on this website involves actual monetary transactions or opportunities for financial gain or loss.</li>
                    <li><span className="important">Gambling should be approached with extreme caution.</span> The risks associated with it are well-documented, and this website does not encourage participation in any form of real gambling.</li>
                    <li><span className="important">You understand that we are not responsible for any actions taken outside of this website.</span> If you choose to engage in gambling elsewhere, we strongly encourage responsible decision-making and adherence to local laws and regulations.</li>
                </ul>

                <p>This website is meant to be <span className="important">an informative and humorous critique, not a gambling platform.</span> If you are looking for responsible financial decisions, gambling is unlikely to be one of them.</p>

                <p>Thank you for taking the time to read this disclaimer. If you choose to continue, please do so with the understanding that this site is purely satirical.</p>

                <a className="button" onClick={goToUserEntry}>I Understand</a>
            </div>
        </>
    );
}

export default TermsOfServicePage;