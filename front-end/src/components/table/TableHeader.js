import React from 'react'

export default function TableHeader(props) {
    
    return (
        <div>
            <span className="text-center align-middle">
                <h1>
                    {props.title}
                </h1>
            </span>
        </div>
    )
}