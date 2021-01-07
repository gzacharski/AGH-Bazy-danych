import React from "react";
import Button from "@material-ui/core/Button";

function TextButton(props) {
    const {onClick, text} = props;
    return (
        <Button onClick={onClick}
                variant="contained"
                color="primary"
                type="button">
            {text}
        </Button>
    );
}

export default TextButton;