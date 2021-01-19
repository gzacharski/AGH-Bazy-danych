import EditButton from "../buttons/EditButton";
import EditRowDialog from '../dialogs/editRowDialogs/EditRowDialog';
import InfoButton from '../buttons/InfoButton';
import MoreRowInfoDialog from '../dialogs/infoRowDialogs/MoreRowInfoDialog';
import React, {useState} from 'react';
import RemoveButton from '../buttons/RemoveButton';
import RemoveRowDialog from '../dialogs/RemoveRowDialog';
import ProductInfoDialog from '../dialogs/infoRowDialogs/ProductInfoDialog';
import OrderInfoDialog from '../dialogs/infoRowDialogs/OrderInfoDialog';
import EditProductDialog from '../dialogs/editRowDialogs/EditProductDialog';
import EditOrderDialog from '../dialogs/editRowDialogs/EditOrderDialog';

export default function RowActions(props) {

    const {data, headers, title}=props;
    const {update,remove,read}=props.crudActions;

    const [openMoreInfo, setOpenMoreInfo] = useState(false);
    const handleOpenMoreInfo = () => setOpenMoreInfo(true);
    const handleCloseMoreInfo = () => setOpenMoreInfo(false);

    const [openEdit,setOpenEdit]=useState(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit= () => setOpenEdit(false);

    const [openRemove, setOpenRemove]=useState(false);
    const handleOpenRemove =() => setOpenRemove(true);
    const handleCloseRemove = () => setOpenRemove(false);

    const moreInfoDialog=(read,title,openMoreInfo)=>{
        if(title==="Products"){
            return (
                <ProductInfoDialog
                    row={data}
                    titles={headers}
                    onClose={handleCloseMoreInfo} 
                    open={openMoreInfo}
                    getRow={read}
                />
            );
        }else if(title==="Orders"){
            return (
                <OrderInfoDialog
                    row={data}
                    titles={headers}
                    onClose={handleCloseMoreInfo} 
                    open={openMoreInfo}
                    getRow={read}
                />
            );
        }else{
            return(
                <MoreRowInfoDialog 
                    row={data}
                    titles={headers}
                    onClose={handleCloseMoreInfo} 
                    open={openMoreInfo}
                    getRow={read}
                />
            );
        }
    }

    const editDialog=(edit,title,openEdit)=>{
        if(title==="Products"){
            return(
                <EditProductDialog
                    row={data}
                    titles={headers}
                    onClose={handleCloseEdit} 
                    open={openEdit}
                    updateRow={update}
                />
            );
        }else if(title==="Orders"){
            return(
                <EditOrderDialog
                    row={data}
                    titles={headers}
                    onClose={handleCloseEdit} 
                    open={openEdit}
                    updateRow={update}
                />
            );
        }else{
            return(
                <EditRowDialog
                    row={data}
                    titles={headers}
                    onClose={handleCloseEdit} 
                    open={openEdit}
                    updateRow={update}
                />
            );
        }
    }

    return (
        <td className="d-flex">
            <InfoButton
                handleOpen={handleOpenMoreInfo}
            />
            {moreInfoDialog(read,title,openMoreInfo)}
            <EditButton
                handleOpen={handleOpenEdit}
            />
            {editDialog(update,title,openEdit)}
            <RemoveButton
                handleOpen={handleOpenRemove}
            />
            <RemoveRowDialog
                row={data}
                titles={headers}
                onClose={handleCloseRemove} 
                open={openRemove}
                deleteRow={remove}
            />
        </td>
    )
}
