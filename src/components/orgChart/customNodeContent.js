const CustomNodeContent = (props) => {
  return (
    <>
      <div
        style={{
          paddingTop: "30px",
          backgroundColor: "none",
          marginLeft: "1px",
          height: props.height + "px",
          borderRadius: "2px",
          overflow: "visible",
        }}
      >
        <div
          style={{
            height: props.height - 32 + "px",
            paddingTop: "0px",
            backgroundColor: "white",
            border: "1px solid lightgray",
          }}
        >
          <img
            src={props.data.photoUrl}
            style={{
              marginTop: "-30px",
              marginLeft: props.width / 2 - 30 + "px",
              borderRadius: "100px",
              width: "60px",
              height: "60px",
            }}
          />

          <div
            style={{ marginRight: "10px", marginTop: "15px", float: "right" }}
          >
            {props.data.area}
          </div>

          <div
            style={{
              marginTop: "-30px",
              backgroundColor: "#3AB6E3",
              height: "10px",
              width: props.width - 2 + "px",
              borderRadius: "1px",
            }}
          ></div>

          <div
            style={{ padding: "20px", paddingTop: "35px", textAlign: "center" }}
          >
            <div
              style={{ color: "#111672", fontSize: "16px", fontWeight: "bold" }}
            >
              {" "}
              {props.data.name + " <" + props.data.email + ">"}{" "}
            </div>
            <div
              style={{ color: "#404040", fontSize: "16px", marginTop: "4px", textTransform: "uppercase" }}
            >
              {" "}
              {props.data.title}{" "}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            <div> Gerencia: {props.data._directSubordinates} 👤</div>
            <div> Supervisiona: {props.data._totalSubordinates} 👤</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomNodeContent;