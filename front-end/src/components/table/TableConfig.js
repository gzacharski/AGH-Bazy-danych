import React, {useState} from 'react';
import { BsGear } from 'react-icons/bs';
import ConfigDialog from '../ConfigDialog';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

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
            <Tooltip title="Add">
                <IconButton aria-label="Add">
                    <BsGear onClick={handleOpen} />
                </IconButton>
            </Tooltip>
            <ConfigDialog
                allColumns={allColumns}
                open={open}
                onClose={handleClose}
            />
        </>
    );
}