import React, { useContext } from 'react';
import { FaSave as IconSave } from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import { browserDownload } from '../../utils/browser';
import { Project } from '../../class/export';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';

interface ToolbarSaveButtonProps {
  state: State;
}

export default function ToolbarSaveButton({ state }: ToolbarSaveButtonProps) {
  const { translator } = useContext(ReactPlannerContext);

  const saveProjectToFile = e => {
    e.preventDefault();
    state = Project.unselectAll(state);
    browserDownload(state.scene);
  };

  return (
    <ToolbarButton active={false} tooltip={translator.t('Save project')} onClick={saveProjectToFile}>
      <IconSave />
    </ToolbarButton>
  );
}
