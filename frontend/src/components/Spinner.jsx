import React from 'react';
import {ClipLoader} from "react-spinners";

function Spinner() {
    return ( 
        <>
        <section style={{
            minHeight: "550px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <ClipLoader color={"#4280c6"} size={150} />
        </section>
        </>
     );
}

export default Spinner;