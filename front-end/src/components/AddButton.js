import React, { useState } from 'react';
import AddDialog from './AddDialog';
import Tooltip from '@material-ui/core/Tooltip';
import { IoMdAdd } from 'react-icons/io';
import IconButton from '@material-ui/core/IconButton';

export default function AddButton() {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="Add">
                <IconButton aria-label="Add">
                    <IoMdAdd onClick={handleOpen} />
                </IconButton>
            </Tooltip>
            <AddDialog
                open={open}
                onClose={handleClose}
            />
        </>
    );
}
