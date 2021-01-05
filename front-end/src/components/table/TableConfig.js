import ConfigButton from '../buttons/ConfigButton';
import ConfigDialog from '../dialogs/ConfigDialog';
import React, {useState} from 'react';

export default function TableConfig(props) {

    const {allColumns}=props;
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>  
            <ConfigButton
                handleOpen={handleOpen}
            />
            <ConfigDialog
                allColumns={allColumns}
                open={open}
                onClose={handleClose}
            />
        </>
    );
}