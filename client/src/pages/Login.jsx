import React, { useEffect } from "react";
import { LoginForm } from "@/components";

function Login() {
    useEffect(() => { document.title = "Login - MorphDeck"; }, []);
    return (
        <LoginForm/>
    )
}

export default Login;