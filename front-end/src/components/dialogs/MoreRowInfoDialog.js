import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import React from 'react';

export default function MoreInfoDialog(props) {

    const { row, onClose, open } = props;

    return (
        <Dialog
            onClose={onClose}
            open={open}
        >
            <DialogTitle>More info</DialogTitle>
            <Divider />
            <DialogContent>
                <table>
                    <thead></thead>
                    <tbody>
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        <span className="cell">
                                            {cell.render('Cell')}
                                        </span>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    Ok
                </button>
            </DialogActions>
        </Dialog>
    )
}
