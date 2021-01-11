import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React, {useState} from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function EditRowDialog(props) {

    const classes = useStyles();
    const {onClose, open,updateRow} = props;

    const [row,setRow]=useState(props.row);

    const handleChangeRow=(e)=>{

        const cellName=e.target.name;
        const cellValue=e.target.value;

        const tempCells=row.cells.map(cell=>{
            if(cell.column.Header===cellName){
                let tempCell=cell;
                tempCell.value=cellValue;
                return tempCell;
            }else{
                return cell;
            }
        });

        setRow({cells:tempCells})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Submit form..");
        updateRow(row);
        onClose();
    }

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Edit</DialogTitle>
            <Divider />
            <DialogContent>
                <form id="editForm" className={classes.root} onSubmit={handleSubmit} noValidate>
                    {row.cells.map(cell => {
                        return (
                            <TextField
                                fullWidth
                                label={cell.column.Header}
                                variant="outlined"
                                name={cell.column.Header}
                                defaultValue={cell.value}
                                onChange={handleChangeRow}
                                disabled={cell.column.Header==="Id"}
                            />
                        );
                    })}
                </form>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" form="editForm" className="btn btn-light" >
                    Ok
                </button>
            </DialogActions>
        </Dialog>
    )
}
