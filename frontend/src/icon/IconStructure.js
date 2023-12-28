import React from 'react';

const IconStructure = ({data, color, size, index, radius, viewBox, x, y}) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        x={x} y={y}
        viewBox={viewBox}
        style={{ strokeWidth: '3', stroke: color }}>
        <g fill={color} fillRule="nonzero" stroke="none" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}>
          <g transform="scale(5.12,5.12)">
            <path d={data}></path>
          </g>
        </g>
      </svg>
    )
}
  
export default IconStructure;
