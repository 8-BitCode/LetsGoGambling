import React from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';





const TermsOfServicePage = () => {
    return(
        <>
        
        <Helmet>
            <title>Terms Of Service</title>
        </Helmet>

        <div>Terms of serice page</div>

        </>
    );
}

export default TermsOfServicePage;
