const tableStyle = { width: '100%', borderSpacing: '2px 0', marginBottom: '2px' } as const;
const firstTdStyle = { width: '6em', textTransform: 'capitalize' } as const;

const PropertyStyle = {
  tableStyle,
  firstTdStyle
} as const;

export default PropertyStyle;
