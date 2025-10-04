import React, { useContext } from 'react';

import { FaFolderOpen as IconLoad } from 'react-icons/fa';

import { State } from '../../models';
import ReactPlannerContext from '../../react-planner-context';
import { browserUpload } from '../../utils/browser';

import ToolbarButton from './toolbar-button';

interface ToolbarLoadButtonProps {
  state: State;
}

export default function ToolbarLoadButton({ state }: ToolbarLoadButtonProps) {
  const { projectActions, translator } = useContext(ReactPlannerContext);

  const loadProjectFromFile = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
  };

  return (
    <ToolbarButton
      active={false}
      tooltip={translator.t('Load project')}
      onClick={loadProjectFromFile}
    >
      <IconLoad />
    </ToolbarButton>
  );
}
