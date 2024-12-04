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


// Creates an extra node related to root that aggregate parentless nodes, removing them from the top level
const FIXME_NODE_ID = 'fixme@fixme.com';
const getFixMeNode = (teamView) => ({
  name: "Fix Me",
  id: FIXME_NODE_ID,
  email: FIXME_NODE_ID,
  managedByEmail: teamView ? 'root' : process.env.ROOT_NODE_ID,
  parentId: teamView ? 'root' : process.env.ROOT_NODE_ID,
  photoUrl: "https://placecats.com/g/200/200",
  title: "",
  area: "",
  team: "",
  // control fields
  _isFixmeNode: true,
  _isTeamNode: teamView,
});

const groupUsersByTeam = async (users, debugMode) => {
  // creates a new root user called "Org"
  const orgNode = {
    name: "Org",
    id: 'root',
    email: '',
    managedByEmail: "",
    parentId: "",
    photoUrl: "https://placecats.com/g/200/200",
    title: "",
    area: "",
    team: "",
    // control fields
    _isRootNode: true,
    _isTeamNode: true
  };

  // read all users and map each existing team, creates a note for each 
  // and assign their parent to the root node
  const existingTeams = users
    .map((user) => user.team.trim().toLowerCase())
    .filter(teamName => teamName && teamName !== '');

  const teamNodes = [...new Set(existingTeams)].map((team) => ({
    name: team,
    id: team,
    email: team,
    managedByEmail: 'root',
    parentId: 'root',
    team: '',
    photoUrl: "https://placecats.com/g/200/200",
    title: "",
    area: "",
    // control fields
    _isTeamNode: true,
  }));

  // reads users and assign all of them to their respective team
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // if user is fixme, root or team, then skip
    if ([FIXME_NODE_ID, 'root'].includes(user.id)) {
      continue
    }

    user.parentId = user.team.trim().toLowerCase();

    // if a users does not have a team, then
    //   if debugMode is true, then add it to the fixme node
    //   if debugMode is false, then remove it from the view
    if (!user.team.trim().toLowerCase()) {
      if (debugMode) {
        user.parentId = FIXME_NODE_ID;
      } else {
        // remove from the list
        users.splice(i, 1);
      }
    }

    user.id = user.email.trim().toLowerCase();
  }

  const allUsers = [orgNode, ...teamNodes, ...users];

  if (debugMode) {
    const fixMeNode = getFixMeNode(true);
    return [fixMeNode, ...allUsers];
  }

  return allUsers;
}

export const listUsers = async (debugMode = false, teamView = false) => {
  let users = await cachedResult(
    usersStore.listUsers,
    'listUsers',
    process.env.CACHE_TTL_S
  );

  if (teamView) {
    return await groupUsersByTeam(users, debugMode);
  }

  const existingParentsList = users.map((user) =>
    user.email.trim().toLowerCase()
  );

  for (let i = 0; i < users.length; i++) {
    // Reassign parent id to root node, except for the root node
    const user = users[i];

    if (user.email.trim().toLowerCase() === process.env.ROOT_NODE_ID) {
      user.id = user.email.trim().toLowerCase();
      user.parentId = "";
      user._isRootNode = true;

      continue;
    }
    if (user.id === FIXME_NODE_ID) {
      continue;
    }

    if (
      !existingParentsList.includes(user.managedByEmail?.trim().toLowerCase())
    ) {
      user.managedByEmail = FIXME_NODE_ID;

      // go down the tree and mark other users as managed by the intermediate node too
      const managedUsers = users.filter(mUser => mUser.managedByEmail === user.email);
      managedUsers.forEach(managedUser => {
        managedUser.managedByEmail = FIXME_NODE_ID;
      });
    }

    user.id = user.email.trim().toLowerCase();
    user.parentId = user.managedByEmail.trim().toLowerCase();
  }

  if (!debugMode) {
    users = users.filter(
      (user) =>
        user.parentId !== FIXME_NODE_ID &&
        user.id !== FIXME_NODE_ID
    );
  }

  if (debugMode) {
    const fixMeNode = getFixMeNode(false);
    return [fixMeNode, ...users];
  }

  return users;
};
