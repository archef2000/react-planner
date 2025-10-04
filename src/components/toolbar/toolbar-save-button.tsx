import React, { useContext } from 'react';

import { FaSave as IconSave } from 'react-icons/fa';

import { Project } from '../../class/export';
import { State } from '../../models';
import ReactPlannerContext from '../../react-planner-context';
import { browserDownload } from '../../utils/browser';

import ToolbarButton from './toolbar-button';

interface ToolbarSaveButtonProps {
  state: State;
}

export default function ToolbarSaveButton({ state }: ToolbarSaveButtonProps) {
  const { translator } = useContext(ReactPlannerContext);

  const saveProjectToFile = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    state = Project.unselectAll(state);
    browserDownload(state.scene);
  };

  return (
    <ToolbarButton
      active={false}
      tooltip={translator.t('Save project')}
      onClick={saveProjectToFile}
    >
      <IconSave />
    </ToolbarButton>
  );
}
