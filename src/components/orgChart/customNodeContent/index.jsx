import PersonNodeContent from "./personNodeContent";
import TeamNodeContent from "./teamNodeContent";

const CustomNodeContent = (props) => {
  const { data } = props;

  if (data._isTeamNode) {
    return <TeamNodeContent {...props} />;
  }

  return <PersonNodeContent {...props} />;
};

export default CustomNodeContent;
