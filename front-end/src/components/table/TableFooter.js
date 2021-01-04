import React from 'react'

export default function TableFooter(props) {

    const {pageIndex,pageOptions}=props;
    
    return (
        <div className="d-flex justify-content-center">
        <span>
            Page{' '}
            <strong>
                {pageIndex + 1} of {pageOptions.length}
            </strong>
        </span>
    </div>
    )
}
