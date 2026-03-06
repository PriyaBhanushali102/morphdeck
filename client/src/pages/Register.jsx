import React, { useEffect } from "react";
import { RegisterForm } from "@/components";

function Register() {
    useEffect(() => { document.title = "Register - MorphDeck"; }, []);
    return (
        <RegisterForm/>
    )
}

export default Register;