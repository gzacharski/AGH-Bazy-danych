import React from 'react';
import { BsGear } from 'react-icons/bs';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default function ConfigButton(props) {
    
    const { handleOpen } = props;

    return (
        <Tooltip 
            title="Add"
        >
            <IconButton
                aria-label="Add"
                onClick={handleOpen}
            >
                <BsGear />
            </IconButton>
        </Tooltip>
    )
}
