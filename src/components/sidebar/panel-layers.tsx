import React, { Component } from 'react';

import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { TiDelete, TiPlus } from 'react-icons/ti';

import {
  MODE_2D_PAN,
  MODE_2D_ZOOM_IN,
  MODE_2D_ZOOM_OUT,
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
  MODE_DRAGGING_HOLE,
  MODE_DRAGGING_ITEM,
  MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX,
  MODE_DRAWING_HOLE,
  MODE_DRAWING_ITEM,
  MODE_DRAWING_LINE,
  MODE_FITTING_IMAGE,
  MODE_IDLE,
  MODE_ROTATING_ITEM,
  MODE_UPLOADING_IMAGE,
  MODE_WAITING_DRAWING_LINE,
  ModeType
} from '../../constants';
import { Layer, State } from '../../models';
import ReactPlannerContext from '../../react-planner-context';
import * as SharedStyle from '../../shared-style';
import {
  CancelButton,
  FormNumberInput,
  FormSlider,
  FormSubmitButton,
  FormTextInput
} from '../style/export';

import Panel from './panel';

const VISIBILITY_MODE = {
  MODE_IDLE,
  MODE_2D_ZOOM_IN,
  MODE_2D_ZOOM_OUT,
  MODE_2D_PAN,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE,
  MODE_DRAWING_LINE,
  MODE_DRAWING_HOLE,
  MODE_DRAWING_ITEM,
  MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX,
  MODE_DRAGGING_ITEM,
  MODE_DRAGGING_HOLE,
  MODE_ROTATING_ITEM,
  MODE_UPLOADING_IMAGE,
  MODE_FITTING_IMAGE
} as Record<ModeType, string>;

const styleEditButton = {
  cursor: 'pointer',
  marginLeft: '5px',
  border: '0px',
  background: 'none',
  color: SharedStyle.COLORS.white,
  fontSize: '14px',
  outline: '0px'
} as const;

const tableLayerStyle = {
  width: '100%',
  //cursor: 'pointer',
  overflowY: 'auto',
  maxHeight: '20em',
  display: 'block',
  padding: '0 1em',
  marginLeft: '1px'
} as const;

const iconColStyle = { width: '2em' } as const;
const styleHoverColor = { color: SharedStyle.SECONDARY_COLOR.main } as const;
const styleEditButtonHover = {
  ...styleEditButton,
  ...styleHoverColor
} as const;
const styleAddLabel = { fontSize: '10px', marginLeft: '5px' } as const;
const styleEyeVisible = { fontSize: '1.25em' } as const;
const styleEyeHidden = { ...styleEyeVisible, color: '#a5a1a1' } as const;
const firstTdStyle = { width: '6em' } as const;
const newLayerLableStyle = {
  margin: '0.5em 0',
  fontSize: '1.3em',
  cursor: 'pointer',
  textAlign: 'center'
} as const;
const newLayerLableHoverStyle = {
  ...newLayerLableStyle,
  ...styleHoverColor
} as const;
const layerInputTableStyle = {
  width: '100%',
  borderSpacing: '2px 0',
  padding: '5px 15px'
} as const;
const inputTableButtonStyle = {
  float: 'right',
  marginTop: '0.5em',
  borderSpacing: '0'
} as const;

type PanelLayersProps = {
  state: State;
};

type PanelLayersState = {
  headHovered: boolean;
  layerAddUIVisible: boolean;
  editingLayer: Layer | undefined;
};

export default class PanelLayers extends Component<
  PanelLayersProps,
  PanelLayersState
> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(props: PanelLayersProps, context: typeof ReactPlannerContext) {
    super(props, context);

    this.state = {
      headHovered: false,
      layerAddUIVisible: false,
      editingLayer: undefined
    };
  }

  shouldComponentUpdate(
    nextProps: PanelLayersProps,
    nextState: PanelLayersState
  ) {
    if (
      this.props.state.scene.layers.size !==
      nextProps.state.scene.layers.size ||
      nextState.layerAddUIVisible != this.state.layerAddUIVisible ||
      this.state.editingLayer !== nextState.editingLayer ||
      this.props.state.sceneHistory !== nextProps.state.sceneHistory
    )
      return true;

    return false;
  }

  addLayer(e: React.MouseEvent) {
    e.stopPropagation();
    if (!this.state.layerAddUIVisible) {
      this.context.sceneActions.addLayer('', 0);
      this.setState({ layerAddUIVisible: false });
    } else this.setState({ layerAddUIVisible: !this.state.layerAddUIVisible });
  }

  resetLayerMod(e: React.MouseEvent) {
    e.stopPropagation();
    this.setState({ layerAddUIVisible: false, editingLayer: undefined });
  }

  updateLayer(e: React.MouseEvent, layerData: Layer) {
    e.stopPropagation();
    this.context.sceneActions.setLayerProperties(layerData.id, layerData);
    this.setState({ layerAddUIVisible: false, editingLayer: undefined });
  }

  delLayer(e: React.MouseEvent, layerID: string) {
    e.stopPropagation();
    this.context.sceneActions.removeLayer(layerID);
    this.setState({ layerAddUIVisible: false, editingLayer: undefined });
  }

  render() {
    if (!VISIBILITY_MODE[this.props.state.mode]) return null;

    const scene = this.props.state.scene;
    const isLastLayer = Object.keys(scene.layers).length === 1;

    const editingLayer = this.state.editingLayer;
    return (
      <Panel name={this.context.translator.t('Layers')}>
        <table style={tableLayerStyle}>
          <thead>
            <tr>
              <th colSpan={3}></th>
              <th>{this.context.translator.t('Altitude')}</th>
              <th>{this.context.translator.t('Name')}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scene.layers).map(([layerID, layer]) => {
              const selectClick = (e: React.MouseEvent) => {
                this.context.sceneActions.selectLayer(layerID);
              };
              const configureClick = (e: React.MouseEvent) =>
                this.setState({ editingLayer: layer, layerAddUIVisible: true });

              const swapVisibility = (
                e: React.MouseEvent<SVGElement, MouseEvent>
              ) => {
                e.stopPropagation();
                this.context.sceneActions.setLayerProperties(layerID, {
                  visible: !layer.visible
                });
              };

              const isCurrentLayer = layerID === scene.selectedLayer;

              return (
                <tr
                  key={layerID}
                  onClick={selectClick}
                  onDoubleClick={configureClick}
                  style={!isCurrentLayer ? undefined : styleHoverColor}
                >
                  <td style={iconColStyle}>
                    {!isCurrentLayer ? (
                      <FaEye
                        onClick={swapVisibility}
                        style={
                          !layer.visible ? styleEyeHidden : styleEyeVisible
                        }
                      />
                    ) : null}
                  </td>
                  <td style={iconColStyle}>
                    <FaPencilAlt
                      onClick={configureClick}
                      style={
                        !isCurrentLayer ? styleEditButton : styleEditButtonHover
                      }
                      title={this.context.translator.t('Configure layer')}
                    />
                  </td>
                  <td style={iconColStyle}>
                    {!isLastLayer ? (
                      <FaTrash
                        onClick={(e) => this.delLayer(e, layerID)}
                        style={
                          !isCurrentLayer
                            ? styleEditButton
                            : styleEditButtonHover
                        }
                        title={this.context.translator.t('Delete layer')}
                      />
                    ) : null}
                  </td>
                  <td style={{ width: '6em', textAlign: 'center' }}>
                    [ h : {layer.altitude} ]
                  </td>
                  <td>{layer.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p
          style={
            !this.state.headHovered
              ? newLayerLableStyle
              : newLayerLableHoverStyle
          }
          onMouseOver={() => this.setState({ headHovered: true })}
          onMouseOut={() => this.setState({ headHovered: false })}
          onClick={(e) => this.addLayer(e)}
        >
          {!this.state.layerAddUIVisible ? <TiPlus /> : <TiDelete />}
          <b style={styleAddLabel}>{this.context.translator.t('New layer')}</b>
        </p>

        {this.state.layerAddUIVisible && editingLayer ? (
          <table style={layerInputTableStyle}>
            <tbody>
              <tr style={{ marginTop: '1em' }}>
                <td style={firstTdStyle}>
                  {this.context.translator.t('Name')}:
                </td>
                <td>
                  <FormTextInput
                    value={editingLayer.name}
                    onChange={(e) =>
                      this.setState({
                        editingLayer: { ...editingLayer, name: e.target.value }
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td style={firstTdStyle}>
                  {this.context.translator.t('opacity')}:
                </td>
                <td>
                  <FormSlider
                    min={0}
                    max={100}
                    value={Math.round(editingLayer.opacity * 100)}
                    onChange={(value) =>
                      this.setState({
                        editingLayer: {
                          ...editingLayer,
                          opacity: value[0] / 100
                        }
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td style={firstTdStyle}>
                  {this.context.translator.t('altitude')}:
                </td>
                <td>
                  <FormNumberInput
                    value={editingLayer.altitude}
                    onChange={(e) =>
                      this.setState({
                        editingLayer: {
                          ...editingLayer,
                          altitude: e.target.value
                        }
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td style={firstTdStyle}>
                  {this.context.translator.t('order')}:
                </td>
                <td>
                  <FormNumberInput
                    value={editingLayer.order}
                    onChange={(e) =>
                      this.setState({
                        editingLayer: { ...editingLayer, order: e.target.value }
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <table style={inputTableButtonStyle}>
                    <tbody>
                      <tr>
                        <td>
                          <CancelButton
                            size="small"
                            onClick={(e) => {
                              this.resetLayerMod(e);
                            }}
                          >
                            {this.context.translator.t('Reset')}
                          </CancelButton>
                        </td>
                        <td>
                          <FormSubmitButton
                            size="small"
                            onClick={(e) => {
                              this.updateLayer(e, editingLayer);
                            }}
                          >
                            {this.context.translator.t('Save')}
                          </FormSubmitButton>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </Panel>
    );
  }
}
