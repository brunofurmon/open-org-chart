"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import CustomNodeContent from "@/components/orgChart/customNodeContent";
import { useTranslation } from "@/presentation/i18n/client";

const Home = ({ users }) => {
  const d3Container = useRef(null);
  const [chart, setChart] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  let { t, i18n } = useTranslation("orgchart");

  const setLanguage = useCallback(
    (lng) => i18n.changeLanguage(lng)[i18n],
    [i18n]
  );

  // FIXME: Move to input component
  const onChangeUser = useCallback(
    (e) => {
      setTimeout(() => {
        const user = e.target.value;
        const filteredUsers = users
          .filter(
            (u) =>
              u.name.toLowerCase().includes(user.toLowerCase()) ||
              u.email.toLowerCase().includes(user.toLowerCase())
          )
          .slice(0, 5);
        setSuggestedUsers(filteredUsers);
      }, 500);
    },
    [setSuggestedUsers, users]
  );

  // FIXME: Move to input component
  const onBlurUser = useCallback(() => {
    setTimeout(() => {
      setSuggestedUsers([]);
    }, 100);
  }, [setSuggestedUsers]);

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
    <>
      <div style={{ position: "absolute" }}>
        <input
          type="text"
          placeholder={t("searchUserTemplate")}
          onKeyDown={onChangeUser}
          onBlur={onBlurUser}
        />
        {suggestedUsers.length > 0 && (
          <div
            style={{
              borderWidth: "2px",
              backgroundColor: "white",
            }}
          >
            {suggestedUsers.map((u) => (
              <div key={u.id} onClick={() => setCenteredUser(u.id)}>
                {u.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{}} className="org-chart" ref={d3Container} />

      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <button onClick={() => setLanguage("en")}>EN</button>
        <button onClick={() => setLanguage("pt")}>PT</button>
      </div>
    </>
  );
};

export default Home;
