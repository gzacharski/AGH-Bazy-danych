import React from 'react';
import { useTable } from 'react-table';
import './Table.css';

export default function Table(props) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns: props.columns,
        data: props.data
    })

    return (
        <table {...getTableProps()} className="table table-striped table-hover">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {
                            headerGroup.headers.map(colum => (
                                <th {...colum.getHeaderProps()} className="text-center align-middle">{colum.render('Header')}</th>
                            ))
                        }
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        <span className="cell">{cell.render('Cell')}</span>
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}