import React from 'react';
import { useTable } from 'react-table';
import './Table.css';

const columns = [
    { Header: 'Id', accessor: 'id.low' },
    { Header: 'Country', accessor: 'country' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Contact title', accessor: 'contactTitle' },
    { Header: 'City', accessor: 'city' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Contact name', accessor: 'contactName' },
    { Header: 'Postal code', accessor: 'postalCode' },
    { Header: 'Company name', accessor: 'companyName' },
];

export default function SupplierTable(props) {

    // const columns = useMemo(() => columns, []);
    // const data = useMemo(() => props.data, []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
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