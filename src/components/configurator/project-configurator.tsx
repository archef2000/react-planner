import React, { Component } from 'react';

import { State } from '../../models';
import ReactPlannerContext from '../../react-planner-context';
import {
  CancelButton,
  ContentContainer,
  ContentTitle,
  FormBlock,
  FormLabel,
  FormNumberInput,
  FormSubmitButton
} from '../style/export';

interface ProjectConfiguratorProps {
  state: State;
  width: number;
  height: number;
}

interface ProjectConfiguratorState {
  dataWidth: number;
  dataHeight: number;
}

export default class ProjectConfigurator extends Component<
  ProjectConfiguratorProps,
  ProjectConfiguratorState
> {
  static contextType = ReactPlannerContext;
  context!: React.ContextType<typeof ReactPlannerContext>;

  constructor(
    props: ProjectConfiguratorProps,
    context: typeof ReactPlannerContext
  ) {
    super(props, context);

    const scene = props.state.scene;

    this.state = {
      dataWidth: scene.width,
      dataHeight: scene.height
    };
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { projectActions } = this.context;

    const { dataWidth, dataHeight } = this.state;
    if (dataWidth <= 100 || dataHeight <= 100) {
      alert('Scene size too small');
    } else {
      projectActions.setProjectProperties({
        width: dataWidth,
        height: dataHeight
      });
    }
  }

  render() {
    const { width, height } = this.props;
    const { dataWidth, dataHeight } = this.state;
    const { projectActions, translator } = this.context;

    return (
      <ContentContainer width={width} height={height}>
        <ContentTitle>{translator.t('Project config')}</ContentTitle>

        <form onSubmit={(e) => this.onSubmit(e)}>
          <FormBlock>
            <FormLabel htmlFor="width">{translator.t('width')}</FormLabel>
            <FormNumberInput
              //id='width'
              placeholder="width"
              value={dataWidth}
              onChange={(e) => this.setState({ dataWidth: e.target.value })}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor="height">{translator.t('height')}</FormLabel>
            <FormNumberInput
              //id='height'
              placeholder="height"
              value={dataHeight}
              onChange={(e) => this.setState({ dataHeight: e.target.value })}
            />
          </FormBlock>

          <table style={{ float: 'right' }}>
            <tbody>
              <tr>
                <td>
                  <CancelButton
                    size="large"
                    onClick={(e) => projectActions.rollback()}
                  >
                    {translator.t('Cancel')}
                  </CancelButton>
                </td>
                <td>
                  <FormSubmitButton size="large">
                    {translator.t('Save')}
                  </FormSubmitButton>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </ContentContainer>
    );
  }
}
