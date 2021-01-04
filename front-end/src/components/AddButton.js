import React, {useState} from 'react';
import AddDialog from './AddDialog';
import Tooltip from '@material-ui/core/Tooltip';

export default function AddButton() {

    const [open, setOpen]=useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose =() => {
        setOpen(false);
    }

    return (
        <>  
            <Tooltip title="Add">
                <button className="btn btn-primary" onClick={handleOpen}>Add</button>
            </Tooltip>
            <AddDialog 
                open={open}
                onClose={handleClose}
            />
        </>
    );
}
