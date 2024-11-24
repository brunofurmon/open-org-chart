"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import CustomNodeContent from "@/components/orgChart/customNodeContent";
import { useTranslation } from "@/presentation/i18n/client";
import UserSearchInput from "@/components/userSearchInput";
import LanguageSelector from "@/components/languageSelector";
import styles from "./styles.module.css";
import { OrgChart } from "d3-org-chart";

const Home = ({ users }) => {
  const d3Container = useRef(null);
  const [chart, setChart] = useState(null);
  let { i18n } = useTranslation("orgchart");

  const setCenteredUser = useCallback(
    (userId) => chart.setCentered(userId).render(),
    [chart]
  );

  const renderNodeContent = useCallback((nodeData) => {
    return ReactDOMServer.renderToString(<CustomNodeContent {...nodeData} />);
  }, []);

  // Effect for initial render
  useEffect(() => {
    const chart = new OrgChart();
    chart.layout("top");

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
  }, [users, d3Container, i18n.language, renderNodeContent]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.d3OrgChart} ref={d3Container} />

      <div className={styles.filterContainer}>
        <UserSearchInput users={users} onUserSelected={setCenteredUser} />
      </div>

      <div className={styles.languageSelectorContainer}>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Home;
