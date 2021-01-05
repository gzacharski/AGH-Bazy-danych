import { BsInfoCircle} from 'react-icons/bs';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default function InfoButton(props) {

    const { handleOpen } = props;

    return (
        <Tooltip
            title="Edit"
        >
            <IconButton
                aria-label="Edit"
                onClick={handleOpen}
            >
                <BsInfoCircle/>
            </IconButton>
        </Tooltip>
    )
}
