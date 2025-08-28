import React from 'react';
import { MdArrowBack as Arrow } from 'react-icons/md';
import * as SharedStyle from '../../shared-style';

const breadcrumbStyle = {
  margin: '1.5em',
  display: 'flex'
} as const;

const breadcrumbTextStyle = {
  fontSize: '20px',
  cursor: 'pointer'
} as const;

const breadcrumbLastTextStyle = {
  ...breadcrumbTextStyle,
  fontWeight: 'bolder',
  color: SharedStyle.SECONDARY_COLOR.main
} as const;

const breadcrumbTabStyle = {
  fill: SharedStyle.COLORS.black,
  fontSize: '24px',
  marginLeft: '10px',
  marginRight: '10px'
} as const;

interface CatalogBreadcrumbProps {
  names: Array<{
    name: string;
    action?: () => void;
  }>;
}

export default function CatalogBreadcrumb({ names }: CatalogBreadcrumbProps) {
  const labelNames = names.map((name, ind) => {

    const lastElement = ind === names.length - 1;

    return <div key={ind} style={{ display: 'flex' }}>
      <div style={!lastElement ? breadcrumbTextStyle : breadcrumbLastTextStyle} onClick={name.action || null}>{name.name}</div>
      {!lastElement ? <Arrow style={breadcrumbTabStyle} /> : null}
    </div>
  });

  return <div style={breadcrumbStyle}>{labelNames}</div>;
};
