import React, { useContext } from 'react';
import { FaFolderOpen as IconLoad } from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import { browserUpload } from '../../utils/browser';
import ReactPlannerContext from '../../react-planner-context';
import { State } from '../../models';

interface ToolbarLoadButtonProps {
  state: State;
}

export default function ToolbarLoadButton({ state }: ToolbarLoadButtonProps) {
  const { projectActions, translator } = useContext(ReactPlannerContext);

  const loadProjectFromFile = event => {
    event.preventDefault();
    browserUpload().then((data) => {
      projectActions.loadProject(JSON.parse(data));
    });
  };

  return (
    <ToolbarButton active={false} tooltip={translator.t("Load project")} onClick={loadProjectFromFile}>
      <IconLoad />
    </ToolbarButton>
  );
}
