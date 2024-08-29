import React, { useRef, useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import CustomNodeContent from "./customNodeContent";

const OrganizationalChart = (props) => {
  const d3Container = useRef(null);
  const [chart, setChart] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // FIXME: Move to input component
  const onChangeUser = (e) => {
    setTimeout(() => {
      const user = e.target.value;
      const filteredUsers = props.data
        .filter(
          (u) =>
            u.name.toLowerCase().includes(user.toLowerCase()) ||
            u.email.toLowerCase().includes(user.toLowerCase())
        )
        .slice(0, 5);
      setSuggestedUsers(filteredUsers);
    }, 500);
  };

  // FIXME: Move to input component
  const onBlurUser = () => {
    setTimeout(() => {
      setSuggestedUsers([]);
    }, 100);
  };

  const setCenteredUser = (userId) => {
    chart.setCentered(userId).render();
    setChart(chart);
  };

  // Effect for initial render
  useEffect(() => {
    // https://github.com/bumbeishvili/org-chart/issues/83#issuecomment-963481842
    import("d3-org-chart").then((mod) => {
      /** @type OrgChart */
      const chart = new mod.OrgChart();
      chart.layout("top");
      if (props.data && d3Container.current) {
        chart
          .container(d3Container.current)
          .data(props.data)
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
  }, [props, props.data]);

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
          <div style={{ 
            borderWidth: "2px",
            backgroundColor: "white",
           }}>
            {suggestedUsers.map((u) => (
              <div key={u.id} onClick={() => setCenteredUser(u.id)}>
                {u.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div 
        style={{ }}
        className="org-chart" 
        ref={d3Container}
      />
    </>
  );
};

export default OrganizationalChart;
