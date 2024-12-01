import container from '@/src/container';

const userBackendMode = process.env.USER_BACKEND_MODE || "csv";
const backendModes = ["csv", "googleadmin", "googlesheets"];
if (!backendModes.includes(userBackendMode)) {
  throw new Error(
    `User backend mode ${userBackendMode} not supported. Supported user backend modes: ${backendModes.join(
      ", "
    )}`
  );
}

const backendModeResolver = {
  'csv': () => container.resolve('csvUserStore'),
  'googleadmin': () => container.resolve('googleadminUserStore'),
  'googlesheets': () => container.resolve('googleSpreadsheetUserStore'),
}
const usersStore = backendModeResolver[userBackendMode]();

const { cachedResult } = container.resolve('cache');

const groupUsersByTeam = async (users, debugMode) => {
  // creates a new root user called "Org"
  const orgNode = {
    name: "Org",
    id: 'root',
    email: '-',
    managedByEmail: "",
    parentId: "",
    photoUrl: "https://placecats.com/g/200/200",
    title: "",
    area: "",
    team: "",
  };

  // read all users and map each existing team, creates a note for each 
  // and assign their parent to the root node
  const existingTeams = users.map((user) => user.team.trim().toLowerCase());
  const teamNodes = [...new Set(existingTeams)].map((team) => ({
    name: team,
    id: team,
    email: team,
    managedByEmail: 'root',
    parentId: 'root',
    photoUrl: "https://placecats.com/g/200/200",
    title: "",
    area: "",
    team: "",
  }));

  // reads users and assign all of them to their respective team
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    user.id = user.email.trim().toLowerCase();
    user.parentId = user.team.trim().toLowerCase();

    // if a users does not have a team, then
    //   if debugMode is true, then add it to the fixme node
    //   if debugMode is false, then remove it from the view
    if (!user.team.trim().toLowerCase()) {
      if (debugMode) {
        user.parentId = process.env.ROOT_NODE_ID;
      } else {
        // remove from the list
        users.splice(i, 1);
      }
    }
  }

  return [orgNode, ...teamNodes, ...users];
}

export const listUsers = async (debugMode = false, teamView = false) => {
  let users = await cachedResult(
    usersStore.listUsers,
    'listUsers',
    process.env.CACHE_TTL_S
  );

  if (teamView) {
    return groupUsersByTeam(users, debugMode);
  }

  // Creates an extra node behind the root to aggregate parentless nodes, removing them from the top level
  const fixmeIntermediateNode = {
    name: "Fix Me",
    id: "fixme@fixme.com",
    email: "fixme@fixme.com",
    managedByEmail: process.env.ROOT_NODE_ID,
    parentId: process.env.ROOT_NODE_ID,
    photoUrl: "https://placecats.com/g/200/200",
    title: "",
    area: "",
    team: "",
  };
  users.push(fixmeIntermediateNode);

  const existingParentsList = users.map((user) =>
    user.email.trim().toLowerCase()
  );

  for (let i = 0; i < users.length; i++) {
    // Reassign parent id to root node, except for the root node
    const user = users[i];
    if (user.email.trim().toLowerCase() === process.env.ROOT_NODE_ID) {
      user.id = user.email.trim().toLowerCase();
      user.parentId = "";
      continue;
    }

    if (
      !existingParentsList.includes(user.managedByEmail?.trim().toLowerCase())
    ) {
      user.managedByEmail = fixmeIntermediateNode.id;

      // go down the tree and mark other users as managed by the intermediate node too
      const managedUsers = users.filter(mUser => mUser.managedByEmail === user.email);
      managedUsers.forEach(managedUser => {
        managedUser.managedByEmail = fixmeIntermediateNode.id;
      });
    }

    user.id = user.email.trim().toLowerCase();
    user.parentId = user.managedByEmail.trim().toLowerCase();
  }

  if (!debugMode) {
    users = users.filter(
      (user) =>
        user.parentId !== fixmeIntermediateNode.id &&
        user.id !== fixmeIntermediateNode.id
    );
  }

  console.log({ debugMode, teamView });
  return users;
};
