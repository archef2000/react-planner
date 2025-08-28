import React, { Component } from 'react';
import {
  ContentTitle,
  ContentContainer,
  FormLabel,
  FormBlock,
  FormNumberInput,
  FormSubmitButton,
  CancelButton
} from '../style/export';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';

interface ProjectConfiguratorProps {
  state: State;
  width: number;
  height: number;
}

interface ProjectConfiguratorState {
  dataWidth: number;
  dataHeight: number;
}

export default class ProjectConfigurator extends Component<ProjectConfiguratorProps, ProjectConfiguratorState> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(props, context) {
    super(props, context);

    const scene = props.state.scene;

    this.state = {
      dataWidth: parseInt(scene.width),
      dataHeight: parseInt(scene.height),
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const { projectActions } = this.context;

    let { dataWidth, dataHeight } = this.state;
    dataWidth = dataWidth;
    dataHeight = dataHeight;
    if (dataWidth <= 100 || dataHeight <= 100) {
      alert('Scene size too small');
    } else {
      projectActions.setProjectProperties({ width: dataWidth, height: dataHeight });
    }
  }


  render() {
    const { width, height } = this.props;
    const { dataWidth, dataHeight } = this.state;
    const { projectActions, translator } = this.context;

    return (
      <ContentContainer width={width} height={height}>
        <ContentTitle>{translator.t('Project config')}</ContentTitle>

        <form onSubmit={e => this.onSubmit(e)}>
          <FormBlock>
            <FormLabel htmlFor='width'>{translator.t('width')}</FormLabel>
            <FormNumberInput
              //id='width'
              placeholder='width'
              value={dataWidth}
              onChange={e => this.setState({ dataWidth: e.target.value })}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='height'>{translator.t('height')}</FormLabel>
            <FormNumberInput
              //id='height'
              placeholder='height'
              value={dataHeight}
              onChange={e => this.setState({ dataHeight: e.target.value })}
            />
          </FormBlock>

          <table style={{ float: 'right' }}>
            <tbody>
              <tr>
                <td>
                  <CancelButton size='large'
                    onClick={e => projectActions.rollback()}>{translator.t('Cancel')}</CancelButton>
                </td>
                <td>
                  <FormSubmitButton size='large'>{translator.t('Save')}</FormSubmitButton>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </ContentContainer>
    )
  }
}
