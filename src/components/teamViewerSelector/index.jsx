"use client";

import { useTranslation } from "@/presentation/i18n/client";

const TeamViewerSelector = (props) => {
  const { t } = useTranslation("teamViewerSelector");
  const { teamView, toggleTeamView } = props;

  return (
    <div>
      <input
        type="checkbox"
        id="teamView"
        name="teamView"
        checked={teamView}
        onChange={toggleTeamView}
      />
      <label htmlFor="teamView">{t("teamView")}</label>
    </div>
  );
};

export default TeamViewerSelector;
