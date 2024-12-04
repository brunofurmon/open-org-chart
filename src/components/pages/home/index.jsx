"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import CustomNodeContent from "@/components/orgChart/customNodeContent";
import { useTranslation } from "@/presentation/i18n/client";
import UserSearchInput from "@/components/userSearchInput";
import LanguageSelector from "@/components/languageSelector";
import TeamViewerSelector from "@/components/teamViewerSelector";
import { useUsersContext } from "@/providers/usersProvider";
import styles from "./styles.module.css";
import { OrgChart } from "d3-org-chart";

const Home = ({ debugMode }) => {
  const d3Container = useRef(null);
  const [chart, setChart] = useState(null);
  let { i18n } = useTranslation("orgchart");
  const { setUsers } = useUsersContext();
  const [teamView, setTeamView] = useState(false);

  const toggleTeamView = useCallback(() => {
    setTeamView(!teamView);
  }, [teamView, setTeamView]);

  const setCenteredUser = useCallback(
    (userId) => chart.setCentered(userId).render(),
    [chart]
  );

  const fetchUsers = useCallback(
    async (debugMode = false, teamView = false) => {
      const response = await fetch(
        `/api/users?debug=${debugMode}&teamView=${teamView}`
      );
      const users = await response.json();
      setUsers(users);

      return users;
    },
    [setUsers]
  );

  const renderNodeContent = useCallback((nodeData, teamView) => {
    return ReactDOMServer.renderToString(
      <CustomNodeContent teamView={teamView} {...nodeData} />
    );
  }, []);

  useEffect(() => {
    // initial chart set
    setChart(new OrgChart());
  }, []);

  useEffect(() => {
    // chart config
    if (!chart) return;

    fetchUsers(debugMode, teamView).then((users) => {
      chart
        .container(d3Container.current)
        .layout("top")
        .data(users)
        .nodeWidth((_) => 400)
        .nodeHeight((_) => 175)
        .svgHeight(window.innerHeight - 20)
        .onNodeClick((node) => chart.setCentered(node.id).render())
        .compactMarginBetween((_) => 80)
        .nodeContent((nodeData) => renderNodeContent(nodeData, teamView))
        .render()
        .fit();
    });
  }, [
    d3Container,
    i18n.language,
    renderNodeContent,
    debugMode,
    teamView,
    fetchUsers,
    chart,
  ]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.controlHeaderContainer}>
        <div className={styles.filterContainer}>
          <UserSearchInput onUserSelected={setCenteredUser} />
        </div>

        <div className={styles.teamViewSelectorContainer}>
          <TeamViewerSelector
            teamView={teamView}
            toggleTeamView={toggleTeamView}
          />
        </div>

        <div className={styles.languageSelectorContainer}>
          <LanguageSelector />
        </div>
      </div>

      <div className={styles.d3OrgChart} ref={d3Container} />
    </div>
  );
};

export default Home;
