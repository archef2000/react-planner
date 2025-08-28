import React, { Component } from 'react';
import AttributesEditor from './attributes-editor/attributes-editor';
import { GeometryUtils, MathUtils } from '../../../utils/export';
import * as SharedStyle from '../../../shared-style';
import convert from 'convert-units';
import { MdContentCopy, MdContentPaste } from 'react-icons/md';
import ReactPlannerContext, { ReactPlannerContextProps } from '../../../react-planner-context';
import { Area, Item, Layer, Line, StateProps, Vertex } from '../../../models';
import { CatalogFn } from '../../../catalog/catalog';
import { produce } from 'immer';
import { ElementType, CatalogElementProperty, CatalogElement } from '../../../types';

const PRECISION = 2;

const attrPorpSeparatorStyle = {
  margin: '0.5em 0.25em 0.5em 0',
  border: '2px solid ' + SharedStyle.SECONDARY_COLOR.alt,
  position: 'relative',
  height: '2.5em',
  borderRadius: '2px'
} as const;

const headActionStyle = {
  position: 'absolute',
  right: '0.5em',
  top: '0.5em'
} as const;

const iconHeadStyle = {
  float: 'right',
  margin: '-3px 4px 0px 0px',
  padding: 0,
  cursor: 'pointer',
  fontSize: '1.4em'
} as const;

interface ElementEditorProps {
  state: StateProps;
  element: ElementType;
  layer: Layer;
}

type LineAttributeData = {
  vertexOne: Vertex;
  vertexTwo: Vertex;
  lineLength: { length: number, _length: number, _unit: string };
};

type HoleAttributeData = {
  offset: number;
  offsetA: { length: number, _length: number, _unit: string };
  offsetB: { length: number, _length: number, _unit: string };
};

type PropertyForm = {
  currentValue: Record<string, any>;
  configs: Record<string, any>;
}

type ElementEditorState = {
  attributesFormData: Item | LineAttributeData | HoleAttributeData | {};
  propertiesFormData: Record<string, PropertyForm>;
}

export default class ElementEditor extends Component<ElementEditorProps, ElementEditorState> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(props: ElementEditorProps, context: ReactPlannerContextProps) {
    super(props, context);

    this.state = {
      attributesFormData: this.initAttrData(this.props.element, this.props.layer, context),
      propertiesFormData: this.initPropData(this.props.element, context)
    };

    this.updateAttribute = this.updateAttribute.bind(this);
  }

  shouldComponentUpdate(nextProps: ElementEditorProps, nextState: ElementEditorState) {
    if (
      this.state.attributesFormData !== nextState.attributesFormData ||
      this.state.propertiesFormData !== nextState.propertiesFormData ||
      this.props.state.clipboardProperties !== nextProps.state.clipboardProperties
    ) return true;

    return false;
  }

  componentDidUpdate(prevProps: ElementEditorProps) {
    const { element, layer, state } = this.props;
    const { prototype, id } = element;
    const scene = prevProps.state.scene;
    const selectedLayer = scene.layers[scene.selectedLayer];
    const selected = selectedLayer[prototype][id];

    if (selectedLayer !== layer) this.setState({
      attributesFormData: this.initAttrData(element, layer, this.context),
      propertiesFormData: this.initPropData(element, this.context)
    });
  }

  initAttrData(element: ElementType, layer: Layer, context: ReactPlannerContextProps) {
    switch (element.prototype) {
      case 'items': {
        return element;
      }
      case 'lines': {
        const v_a = layer.vertices[element.vertices[0]];
        const v_b = layer.vertices[element.vertices[1]];

        const distance = GeometryUtils.pointsDistance(v_a.x, v_a.y, v_b.x, v_b.y);
        const _unit = element.misc._unitLength || context.catalog.unit;
        const _length = convert(distance).from(context.catalog.unit).to(_unit);

        return {
          vertexOne: v_a,
          vertexTwo: v_b,
          lineLength: { length: distance, _length, _unit },
        } as LineAttributeData;
      }
      case 'holes': {
        const line = layer.lines[element.line];
        const { x: x0, y: y0 } = layer.vertices[line.vertices[0]];
        const { x: x1, y: y1 } = layer.vertices[line.vertices[1]];
        const lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
        const startAt = lineLength * element.offset - element.properties.width.length / 2;

        const _unitA = element.misc._unitA || context.catalog.unit;
        const _lengthA = convert(startAt).from(context.catalog.unit).to(_unitA);

        const endAt = lineLength - lineLength * element.offset - element.properties.width.length / 2;
        const _unitB = element.misc._unitB || context.catalog.unit;
        const _lengthB = convert(endAt).from(context.catalog.unit).to(_unitB);

        return {
          offset: element.offset,
          offsetA: {
            length: MathUtils.toFixedFloat(startAt, PRECISION),
            _length: MathUtils.toFixedFloat(_lengthA, PRECISION),
            _unit: _unitA
          },
          offsetB: {
            length: MathUtils.toFixedFloat(endAt, PRECISION),
            _length: MathUtils.toFixedFloat(_lengthB, PRECISION),
            _unit: _unitB
          }
        } as HoleAttributeData;
      }
      case 'areas': {
        return {};
      }
    }
  }

  initPropData(element: ElementType, context: ReactPlannerContextProps) {
    const { catalog } = context;
    const catalogElement = CatalogFn.getElement(catalog, element.type);

    type Result = Record<string, { currentValue: any; configs: CatalogElementProperty }>;
    const mapped: Result = {};

    for (const name in catalogElement.properties) {
      const propDef = catalogElement.properties[name];
      const defVal = (propDef && typeof propDef === 'object' && 'defaultValue' in propDef)
        ? (propDef as { defaultValue: any }).defaultValue
        : undefined;
      mapped[name] = {
        currentValue: element.properties[name] ?? defVal,
        configs: propDef
      };
    }
    return mapped;
  }

  updateAttribute(attributeName: string, value: any) {
    const { attributesFormData: oldAttributesFormData } = this.state;
    let newAttributesFormData: ElementEditorState["attributesFormData"];

    switch (this.props.element.prototype) {
      case 'items': {
        newAttributesFormData = { ...oldAttributesFormData, [attributeName]: value };
        break;
      }
      case 'lines': {
        let attributesFormData = oldAttributesFormData as LineAttributeData;
        switch (attributeName) {
          case 'lineLength':
            {
              const v_0 = attributesFormData.vertexOne;
              const v_1 = attributesFormData.vertexTwo;

              const [v_a, v_b] = GeometryUtils.orderVertices([v_0, v_1]);

              const v_b_new = GeometryUtils.extendLine(v_a.x, v_a.y, v_b.x, v_b.y, value.length, PRECISION);

              attributesFormData = produce(attributesFormData, attr => {
                if (v_0 === v_a) {
                  attr.vertexTwo = { ...v_b, ...v_b_new };
                } else {
                  attr.vertexOne = { ...v_b, ...v_b_new };
                }
                attr.lineLength = value;
              });
              break;
            }
          case 'vertexOne':
          case 'vertexTwo':
            {
              attributesFormData = produce(attributesFormData, attr => {
                attr[attributeName] = {
                  ...attr[attributeName],
                  ...value
                }

                const newDistance = GeometryUtils.verticesDistance(attr.vertexOne, attr.vertexTwo);
                attr.lineLength = {
                  ...attr.lineLength,
                  length: newDistance,
                  _length: convert(newDistance).from(this.context.catalog.unit).to(attr.lineLength._unit)
                }
              });
              break;
            }
          default:
            {
              attributesFormData = { ...attributesFormData, [attributeName]: value };
              break;
            }
        }
        newAttributesFormData = attributesFormData;
        break;
      }
      case 'holes': {
        let attributesFormData = oldAttributesFormData as HoleAttributeData;
        switch (attributeName) {
          case 'offsetA':
            {
              const line = this.props.layer.lines[this.props.element.line];

              const orderedVertices = GeometryUtils.orderVertices([
                this.props.layer.vertices[line.vertices[0]],
                this.props.layer.vertices[line.vertices[1]]
              ]);

              const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = orderedVertices;

              const alpha = GeometryUtils.angleBetweenTwoPoints(x0, y0, x1, y1);
              const lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
              const widthLength = this.props.element.properties.width.length;
              const halfWidthLength = widthLength / 2;

              let lengthValue = value.length;
              lengthValue = Math.max(lengthValue, 0);
              lengthValue = Math.min(lengthValue, lineLength - widthLength);

              const xp = (lengthValue + halfWidthLength) * Math.cos(alpha) + x0;
              const yp = (lengthValue + halfWidthLength) * Math.sin(alpha) + y0;

              const offset = GeometryUtils.pointPositionOnLineSegment(x0, y0, x1, y1, xp, yp);

              const endAt = MathUtils.toFixedFloat(lineLength - (lineLength * offset) - halfWidthLength, PRECISION);
              const offsetUnit = attributesFormData.offsetB._unit;

              const offsetB = {
                length: endAt,
                _length: convert(endAt).from(this.context.catalog.unit).to(offsetUnit),
                _unit: offsetUnit
              };

              const offsetA = {
                length: MathUtils.toFixedFloat(lengthValue, PRECISION),
                _unit: value._unit,
                _length: MathUtils.toFixedFloat(convert(lengthValue).from(this.context.catalog.unit).to(value._unit), PRECISION)
              };

              attributesFormData = { ...attributesFormData, offsetB, offset, offsetA };
              break;
            }
          case 'offsetB':
            {
              const line = this.props.layer.lines[this.props.element.line];

              const orderedVertices = GeometryUtils.orderVertices([
                this.props.layer.vertices[line.vertices[0]],
                this.props.layer.vertices[line.vertices[1]]
              ]);

              const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = orderedVertices;

              const alpha = GeometryUtils.angleBetweenTwoPoints(x0, y0, x1, y1);
              const lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
              const widthLength = this.props.element.properties.width.length;
              const halfWidthLength = widthLength / 2;

              let lengthValue = value.length;
              lengthValue = Math.max(lengthValue, 0);
              lengthValue = Math.min(lengthValue, lineLength - widthLength);

              const xp = x1 - (lengthValue + halfWidthLength) * Math.cos(alpha);
              const yp = y1 - (lengthValue + halfWidthLength) * Math.sin(alpha);

              const offset = GeometryUtils.pointPositionOnLineSegment(x0, y0, x1, y1, xp, yp);

              const startAt = MathUtils.toFixedFloat((lineLength * offset) - halfWidthLength, PRECISION);
              const offsetUnit = attributesFormData.offsetA._unit;

              const offsetA = {
                length: startAt,
                _length: convert(startAt).from(this.context.catalog.unit).to(offsetUnit),
                _unit: offsetUnit
              };

              const offsetB = {
                length: MathUtils.toFixedFloat(lengthValue, PRECISION),
                _unit: value._unit,
                _length: MathUtils.toFixedFloat(convert(lengthValue).from(this.context.catalog.unit).to(value._unit), PRECISION)
              };

              attributesFormData = { ...attributesFormData, offsetA, offset, offsetB }

              break;
            }
          default:
            {
              attributesFormData = { ...attributesFormData, [attributeName]: value };
              break;
            }
        };
        newAttributesFormData = attributesFormData;
        break;
      }
      default:
        newAttributesFormData = oldAttributesFormData;
        break;
    }

    this.setState({ attributesFormData: newAttributesFormData });
    this.save({ attributesFormData: newAttributesFormData });
  }

  updateProperty(propertyName: string, value) {
    let { state: { propertiesFormData } } = this;
    propertiesFormData = produce(propertiesFormData, draft => {
      draft[propertyName].currentValue = value;
    });
    this.setState({ propertiesFormData });
    this.save({ propertiesFormData });
  }

  reset() {
    this.setState({ propertiesFormData: this.initPropData(this.props.element, this.context) });
  }

  save({ propertiesFormData, attributesFormData }: { propertiesFormData?: Record<string, any>, attributesFormData?: any }) {

    if (propertiesFormData) {
      const properties = Object.keys(propertiesFormData).reduce((acc, key) => {
        const data = propertiesFormData[key];
        acc[key] = data && data.currentValue !== undefined ? data.currentValue : undefined;
        return acc;
      }, {} as Record<string, any>);

      this.context.projectActions.setProperties(properties);
    }

    if (attributesFormData) {
      switch (this.props.element.prototype) {
        case 'items': {
          this.context.projectActions.setItemsAttributes(attributesFormData);
          break;
        }
        case 'lines': {
          this.context.projectActions.setLinesAttributes(attributesFormData);
          break;
        }
        case 'holes': {
          this.context.projectActions.setHolesAttributes(attributesFormData);
          break;
        }
      }
    }
  }

  copyProperties(properties) {
    this.context.projectActions.copyProperties(properties);
  }

  pasteProperties() {
    this.context.projectActions.pasteProperties();
  }

  render() {
    const {
      state: { propertiesFormData, attributesFormData },
      context: { catalog, translator },
      props: { state: appState, element },
    } = this;

    return (
      <div>

        <AttributesEditor
          element={element}
          onUpdate={this.updateAttribute}
          attributeFormData={attributesFormData}
          state={appState}
        />

        <div style={attrPorpSeparatorStyle}>
          <div style={headActionStyle}>
            <div title={translator.t('Copy')} style={iconHeadStyle} onClick={e => this.copyProperties(element.properties)}><MdContentCopy /></div>
            {
              appState.clipboardProperties && appState.clipboardProperties.size ?
                <div title={translator.t('Paste')} style={iconHeadStyle} onClick={e => this.pasteProperties()}><MdContentPaste /></div> : null
            }
          </div>
        </div>

        {Object.entries(propertiesFormData).map(([propertyName, data]) => {

          const currentValue = data.currentValue, configs = data.configs;

          const { Editor } = CatalogFn.getPropertyType(catalog, configs.type);

          return <Editor
            key={propertyName}
            propertyName={propertyName}
            value={currentValue}
            configs={configs}
            onUpdate={value => this.updateProperty(propertyName, value)}
            state={appState}
            sourceElement={element}
            internalState={this.state}
          />
        })
        }

      </div>
    )
  }
}
