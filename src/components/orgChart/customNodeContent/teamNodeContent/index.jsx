import Image from "next/image";
import { useTranslation } from "@/presentation/i18n/client";
import teamIcon from "@/public/teamIcon.svg";

const TeamNodeContent = (props) => {
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
          alt="Team Picture"
          src={teamIcon}
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
            marginTop: "-30px",
            backgroundColor: "#3AB6E3",
            height: "10px",
            width: props.width - 3 + "px",
          }}
        ></div>

        <div
          style={{
            height: "25px",
            paddingBottom: "25px",
            paddingTop: "50px",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          <div
            style={{ color: "#111672", fontSize: "16px", fontWeight: "bold" }}
          >
            <p style={{ margin: "0" }}>
              {props.data.name.at(0).toUpperCase() + props.data.name.slice(1)}
              {""}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingLeft: "15px",
            paddingRight: "15px",
          }}
        >
          <div>
            {t("members")}: {props.data._directSubordinates} 👤
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamNodeContent;
