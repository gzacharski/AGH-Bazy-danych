import React, {useState} from "react";
import TextButton from '../components/buttons/TextButton';
import axios from "axios";
import './LoginForm.css';

export default function LoginForm(props) {
    const {setCustomerId, setLoggedIn, setAdmin} = props
    const [error, setError] = useState("")
    const [loginDetails, setLoginDetails] = useState({
        login: "",
        password: ""
    })

    function handleChange(event) {
        const { name, value } = event.target;

        setLoginDetails(prevDetails => {
            return {
                ...prevDetails,
                [name]: value
            };
        });
    }

    function afterLogin(loginDetails) {
        //TODO remove hardcoded credentials
        if (loginDetails.login === "admin" && loginDetails.password === "test") {
            setLoggedIn(true);
            setAdmin(true);
            return;
        }
        customerExists(loginDetails.login)
            .then((customerExists) => {
                if (customerExists && loginDetails.password === "test") {
                    setLoggedIn(true);
                    setAdmin(false);
                    setCustomerId(loginDetails.login);
                    setError("");
                } else {
                    setError("Login and password don't match");
                }
            });
    }

    function customerExists(customerId) {
        return axios.get('http://localhost:3000/api/customers/' + customerId)
            .then(response => {
                console.log("Customer exists: ");
                console.log(response);
                return true;
            })
            .catch(error => {
                console.log("Customer doesn't exist: ");
                console.log(error);
                return false;
            })
    }

    function onLogin(event) {
        afterLogin(loginDetails);
        event.preventDefault();
    }

    return (
        <div className="login">
            <form className="form">
                <input name="login" onChange={handleChange} value={loginDetails.login} type="text" placeholder="Login" />
                <br/>
                <input name="password" onChange={handleChange} value={loginDetails.password} type="password" placeholder="Password" />
                <br/>
                <TextButton onClick={onLogin} text="Login"/>
                <div className="error">{error}</div>
            </form>
        </div>
    );
}
