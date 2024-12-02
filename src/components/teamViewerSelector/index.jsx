import { useCallback } from "react";

import { useTranslation } from "@/presentation/i18n/client";

const TeamViewerSelector = ({ setTeamView, teamView }) => {
  const { t } = useTranslation("teamViewerSelector");

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
      <label htmlFor="teamView">{t("teamView")}</label>
    </div>
  );
};

export default TeamViewerSelector;
