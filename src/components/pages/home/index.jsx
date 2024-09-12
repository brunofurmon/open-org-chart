"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import CustomNodeContent from "@/components/orgChart/customNodeContent";
import { useTranslation } from "@/presentation/i18n/client";
import UserSearchInput from "@/components/userSearchInput";
import LanguageSelector from "@/components/languageSelector";
import styles from "./styles.module.css";

const Home = ({ users }) => {
  const d3Container = useRef(null);
  const [chart, setChart] = useState(null);
  let { i18n } = useTranslation("orgchart");

  const setCenteredUser = useCallback(
    (userId) => {
      chart.setCentered(userId).render();
      setChart(chart);
    },
    [chart, setChart]
  );

  // Effect for initial render
  useEffect(() => {
    // https://github.com/bumbeishvili/org-chart/issues/83#issuecomment-963481842
    import("d3-org-chart").then((mod) => {
      /** @type OrgChart */
      const chart = new mod.OrgChart();
      chart.layout("top");
      if (users && d3Container.current) {
        chart
          .container(d3Container.current)
          .data(users)
          .nodeWidth((_) => 300)
          .nodeHeight((_) => 175)
          .compactMarginBetween((_) => 80)
          .nodeContent((d) =>
            ReactDOMServer.renderToStaticMarkup(<CustomNodeContent {...d} />)
          )
          .render();
      }
      setChart(chart);
    });
  }, [users, d3Container, i18n.language]);

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
