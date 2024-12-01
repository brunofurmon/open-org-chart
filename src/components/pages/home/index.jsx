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
  const [teamView, setTeamView] = useState(false);

  const setCenteredUser = useCallback(
    (userId) => chart.setCentered(userId).render(),
    [chart]
  );

  const { users, setUsers } = useUsersContext();

  const fetchUsers = useCallback(
    async (debugMode = false, teamView = false) => {
      // fetch from /api/users
      const response = await fetch(
        `/api/users?debug=${debugMode}&teamView=${teamView}`
      );
      const users = await response.json();
      setUsers(users);

      return users;
    },
    [setUsers]
  );

  const renderNodeContent = useCallback((nodeData) => {
    return ReactDOMServer.renderToString(<CustomNodeContent {...nodeData} />);
  }, []);

  // Effect for initial render
  useEffect(() => {
    fetchUsers(debugMode, teamView).then((users) => {
      const chart = new OrgChart();
      chart.layout("top");

      // debug
      console.log(users);

      if (users && d3Container.current) {
        chart
          .container(d3Container.current)
          .data(users)
          .nodeWidth((_) => 300)
          .nodeHeight((_) => 175)
          .svgHeight(window.innerHeight - 20)
          .onNodeClick((node) => chart.setCentered(node.id).render())
          .compactMarginBetween((_) => 80)
          .nodeContent(renderNodeContent)
          .render();
      }
      setChart(chart);
    });
  }, [
    d3Container,
    i18n.language,
    renderNodeContent,
    debugMode,
    teamView,
    fetchUsers,
  ]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.controlHeaderContainer}>
        <div className={styles.filterContainer}>
          <UserSearchInput users={users} onUserSelected={setCenteredUser} />
        </div>

        <div className={styles.teamViewSelectorContainer}>
          <TeamViewerSelector teamView={teamView} setTeamView={setTeamView} />
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
