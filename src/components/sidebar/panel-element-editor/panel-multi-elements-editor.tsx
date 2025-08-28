import React, { Component } from 'react';
import Panel from '../panel';
import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../../constants';
import { FormSelect } from '../../../components/style/export';
import { Group } from '../../../class/export';
import ReactPlannerContext from '../../../react-planner-context';
import { State } from '../../../models';

const tableStyle = { width: '100%' } as const;
const firstTdStyle = { width: '6em' } as const;

interface PanelMultiElementsEditorProps {
  state: State;
}

interface PanelMultiElementsEditorState {
  selectedGroupID: string;
}

export default class PanelMultiElementsEditor extends Component<PanelMultiElementsEditorProps, PanelMultiElementsEditorState> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedGroupID: ''
    };
  }

  addSelectToGroup(state, groupID, layerID, selecteds) {
    if (!groupID || groupID === '' || !selecteds || !selecteds.size) return;

    console.log('need to be added to group', groupID, 'elements', selecteds);

    /*let selectedJs = selecteds.toJS();

    for( let lineID in selectedJs.lines ) Group.addElement( state, groupID, layerID, 'lines', lineID );*/
  }

  render() {
    const { mode } = this.props.state;

    if (![MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN,
      MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
      MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM,
      MODE_DRAGGING_LINE, MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE,
      MODE_ROTATING_ITEM, MODE_UPLOADING_IMAGE, MODE_FITTING_IMAGE].includes(mode)) return null;

    const groups = this.props.state.scene.groups;

    //TODO change in multi-layer check
    const selectedLayer = this.props.state.scene.selectedLayer;
    const selecteds = this.props.state.scene.layers[selectedLayer].selected;

    return (
      <Panel name={'Multiselected'} opened={true}>
        <div style={{ padding: '5px 15px' }}>
          <p>Multiselection tab</p>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <td style={firstTdStyle}>Add to Group</td>
                <td>
                  <FormSelect value={this.state.selectedGroupID} onChange={e => this.setState({ 'selectedGroupID': e.target.value })}>
                    <option key={0} value={''}></option>
                    {
                      Object.entries(groups).map(([groupID, group]) => <option key={groupID} value={groupID}>{group.name}</option>)
                    }
                  </FormSelect>
                </td>
                <td style={{ cursor: 'pointer', padding: '0.5em 0', textAlign: 'center' }} onClick={e => {
                  if (!this.state.selectedGroupID || this.state.selectedGroupID === '' || !selecteds) return;

                  for (let x = 0; x < selecteds.lines.length; x++)
                    this.context.groupsActions.addToGroup(this.state.selectedGroupID, selectedLayer, 'lines', selecteds.lines[x]);
                }}>+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    );
  }
}
