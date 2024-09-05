"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOMServer from "react-dom/server";
import CustomNodeContent from "./customNodeContent";

const OrganizationalChart = ({ users }) => {
  const d3Container = useRef(null);
  const [chart, setChart] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

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
          .nodeWidth((d) => 300)
          .nodeHeight((d) => 175)
          .compactMarginBetween((d) => 80)
          .nodeContent((d) => {
            return ReactDOMServer.renderToStaticMarkup(
              <CustomNodeContent {...d} />
            );
          })
          .render();
      }
      setChart(chart);
    });
  }, [users]);

  return (
    <>
      <div style={{ position: "absolute" }}>
        <input
          type="text"
          placeholder="Buscar nome ou email"
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
    </>
  );
};

export default OrganizationalChart;
