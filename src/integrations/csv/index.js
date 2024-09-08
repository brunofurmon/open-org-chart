import fs from "fs";
import csv from "csv-parser";

// Returns a User model from a CSV file
// returns { name, email, photoUrl, managedByEmail, title, area }
const toDomainModel = (user) => {
  const name = user["Full Name"];
  const email = user["Email"];
  const photoUrl = user["Photo URL"];
  const managedByEmail = user["Managed By Email"];
  const title = user["Title"];
  const area = user["Area"];

  return { name, email, photoUrl, managedByEmail, title, area };
};

// Module must implement
// listUsers: () => Promise<User[]>
const init = ({ logger }) => {
  const filePath = process.env.CSV_FILE_PATH;

  const listUsers = async () => {
    const usersList = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          usersList.push(data);
        })
        .on("end", () => {
          logger.debug(`Found ${usersList.length} users on the CSV file`);
          const mappedUsers = usersList.map(toDomainModel);
          resolve(mappedUsers);
        })
        .on("error", (error) => {
          logger.error('error reading CSV file:', error);
          reject(error);
        });
    });
  };

  return { listUsers };
};

export default init;
