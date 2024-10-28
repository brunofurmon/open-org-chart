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

export const listUsers = async (debugMode = false) => {
  let users = await cachedResult(
    usersStore.listUsers,
    'listUsers',
    process.env.CACHE_TTL_S
  );

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
  return users;
};
