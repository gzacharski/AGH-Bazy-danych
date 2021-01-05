import EditButton from "../buttons/EditButton";
import EditRowDialog from '../dialogs/EditRowDialog';
import InfoButton from '../buttons/InfoButton';
import MoreRowInfoDialog from '../dialogs/MoreRowInfoDialog';
import React, {useState} from 'react';
import RemoveButton from '../buttons/RemoveButton';
import RemoveRowDialog from '../dialogs/RemoveRowDialog';

export default function RowActions(props) {

    const {data}=props;

    const [openMoreInfo, setOpenMoreInfo] = useState(false);

    const handleOpenMoreInfo = () => {
        setOpenMoreInfo(true);
    }

    const handleCloseMoreInfo = () => {
        setOpenMoreInfo(false);
    }

    const [openEdit,setOpenEdit]=useState(false);

    const handleOpenEdit = () => {
        setOpenEdit(true);
    }

    const handleCloseEdit= () => {
        setOpenEdit(false);
    }

    const [openRemove, setOpenRemove]=useState(false);

    const handleOpenRemove =() => {
        setOpenRemove(true);
    }

    const handleCloseRemove = () => {
        setOpenRemove(false);
    }

    return (
        <td className="d-flex">
            <InfoButton
                handleOpen={handleOpenMoreInfo}
            />
            <MoreRowInfoDialog 
                row={data}
                onClose={handleCloseMoreInfo} 
                open={openMoreInfo}
            />
            <EditButton 
                handleOpen={handleOpenEdit}
            />
            <EditRowDialog
                row={data}
                onClose={handleCloseEdit} 
                open={openEdit}
            />
            <RemoveButton
                handleOpen={handleOpenRemove}
            />
            <RemoveRowDialog
                row={data}
                onClose={handleCloseRemove} 
                open={openRemove}
            />
        </td>
    )
}