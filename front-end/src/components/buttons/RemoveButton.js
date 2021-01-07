import { BsTrash } from 'react-icons/bs';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default function InfoButton(props) {
    
    const { handleOpen } = props;

    return (
        <Tooltip
            title="Remove"
        >
            <IconButton
                aria-label="Remove"
                onClick={handleOpen}
            >
                <BsTrash />
            </IconButton>
        </Tooltip>
    )
}
