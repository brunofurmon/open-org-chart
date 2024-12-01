import { useCallback } from "react";

const TeamViewerSelector = ({ setTeamView, teamView }) => {
  const setTeamViewCallback = useCallback(
    () => setTeamView(!teamView),
    [setTeamView, teamView]
  );

  return (
    <div>
      <input
        type="checkbox"
        id="teamView"
        name="teamView"
        checked={teamView}
        onChange={setTeamViewCallback}
      />
      <label htmlFor="teamView">Team View</label>
    </div>
  );
};

export default TeamViewerSelector;
