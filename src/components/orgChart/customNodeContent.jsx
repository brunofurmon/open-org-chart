import Image from "next/image";
import { useTranslation } from "@/presentation/i18n/client";

const CustomNodeContent = (props) => {
  const { t } = useTranslation("orgchart");

  return (
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
        <Image
          alt="profile picture"
          src={props.data.photoUrl}
          width={60}
          height={60}
          style={{
            marginTop: "-30px",
            marginLeft: props.width / 2 - 30 + "px",
            borderRadius: "100px",
          }}
        />

        <div
          style={{
            marginRight: "10px",
            marginTop: "15px",
            float: "right",
            maxWidth: props.width / 4,
          }}
        >
          <div>
            <p>{props.data.area}</p>
            <p>{props.data.team}</p>
          </div>
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
            style={{
              color: "#404040",
              fontSize: "16px",
              marginTop: "4px",
              textTransform: "uppercase",
            }}
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
          <div>
            {t("manages")}: {props.data._directSubordinates} 👤
          </div>
          <div>
            {t("supervises")}: {props.data._totalSubordinates} 👤
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNodeContent;
