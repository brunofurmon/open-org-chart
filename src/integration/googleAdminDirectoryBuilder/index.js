const { google } = require("googleapis");

const toDomainModel = (user) => {
  const name = user.name.fullName;
  const email = user.primaryEmail;
  const photoUrl = user.thumbnailPhotoUrl;
  const managedByEmail = user.relations?.find(
    (relation) => relation.type === "manager"
  )?.value;
  const title = user.organizations?.find(
    (organization) => organization.primary
  )?.title;
  const area = user.organizations?.find(
    (organization) => organization.primary
  )?.department;

  return { name, email, photoUrl, managedByEmail, title, area };
};

const init = ({ logger }) => {
  let authClient = null;

  const getAuthClient = async () => {
    if (authClient && authClient.credentials.access_token) {
      return authClient;
    }

    const credentials = require("../../../credentials.json");

    // Configure authentication
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/admin.directory.user.readonly",
        "https://www.googleapis.com/auth/cloud-platform",
      ],
    });

    // Create a client
    const client = await auth.getClient();
    client.subject = process.env.AUTH_CLIENT_SUBJECT;
    authClient = client;

    return client;
  };

  // Recursive function to retrieve all users
  const listUsers = async (usersList = [], pageToken = undefined) => {
    const auth = await getAuthClient();
    const directory = google.admin({ version: "directory_v1", auth });

    // Read user data
    try {
      const response = await directory.users.list({
        customer: process.env.WORKSPACE_CUSTOMER_ID,
        domain: process.env.WORKSPACE_DOMAIN,
        orderBy: "email",
        maxResults: 100,
        pageToken,
        query: "isSuspended=false",
        projection: "basic",
      });
      logger.info("Fetched 100 users from Google Admin API");

      usersList.push(...response.data.users);

      // Check if there are more pages available
      if (response.data.nextPageToken) {
        // Make a recursive call to retrieve the next page of users
        return await listUsers(usersList, response.data.nextPageToken);
      }

      const mappedUsers = usersList.map(toDomainModel);

      return mappedUsers;
    } catch (error) {
      logger.error(error);
    }
  };

  return { listUsers };
};

module.exports = init;
