import React from "react";
import Button from "@material-ui/core/Button";

function LoginButton(props) {
    return (
        <Button onClick={props.onClick}
                variant="contained"
                color="primary"
                type="button">
            Login
        </Button>
    );
}

export default LoginButton;