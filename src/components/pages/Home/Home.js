import OrganizationalChart from "../../orgChart";

const Home = (props) => {
  const { users } = props;

  return (
    <>
      <OrganizationalChart data={users} />
    </>
  );
};

Home.getInitialProps = async (ctx) => {
  const { locals } = ctx.res;
  return {
    users: locals.users,
  };
};

export default Home;
