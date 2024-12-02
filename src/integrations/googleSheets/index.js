import { google } from "googleapis";

// Returns a User model from Google Sheets
// returns { name, email, photoUrl, managedByEmail, title, area }
const processRows = (rows) => {
  // parse each Column to guarantee access to correct indexes
  const columns = rows[0];
  const nameIndex = columns.indexOf("Full Name");
  const emailIndex = columns.indexOf("Email");
  const photoUrlIndex = columns.indexOf("Photo URL");
  const managedByEmailIndex = columns.indexOf("Managed by Email");
  const titleIndex = columns.indexOf("Title");
  const areaIndex = columns.indexOf("Area");
  const teamIndex = columns.indexOf("Team");

  const users = rows.slice(1).map((row) => ({
    name: row[nameIndex],
    email: row[emailIndex],
    photoUrl: row[photoUrlIndex],
    managedByEmail: row[managedByEmailIndex],
    title: row[titleIndex],
    area: row[areaIndex],
    team: row[team]
  }));

  return users;
}

// Module must implement
// listUsers: () => Promise<User[]>
const init = ({ logger }) => {
  const listUsers = async () => {
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      apiKey: process.env.GSHEETS_API_KEY
    });

    const gSheets = google.sheets({ version: "v4", auth });
    let response, rows;
    try {
      logger.info(`Fetching data from Google Sheets with id ${process.env.GSHEETS_SPREADSHEET_ID}`);
      response = await gSheets.spreadsheets.values.get({
        spreadsheetId: process.env.GSHEETS_SPREADSHEET_ID,
        range: "org"
      });
      rows = response?.data?.values;
    } catch (error) {
      logger.error('Error fetching data from Google Sheets', error);
    }

    if (!rows || rows.length === 0) {
      logger.info(`No data found on spreadsheet ${process.env.GSHEETS_SPREADSHEET_ID}`);
      return [];
    }
    logger.info(`Fetched ${rows.length} rows from Google Sheets`);

    return processRows(rows);
  };

  return { listUsers };
};

export default init;
