import { createContainer, asFunction } from "awilix";
import loggerBuilder from "@/infrastructure/logging";
import cacheBuilder from "@/infrastructure/cache";
import googleadminDirectoryBuilder from "@/integrations/googleAdminDirectory";
import googleSpreadsheetBuilder from '@/integrations/googleSheets';
import csvBuilder from "@/integrations/csv";

const container = createContainer();

const cacheEngine = process.env.CACHE_ENGINE;

container.register({
  logger: asFunction(loggerBuilder),
  googleadminUserStore: asFunction(googleadminDirectoryBuilder),
  googleSpreadsheetUserStore: asFunction(googleSpreadsheetBuilder),
  csvUserStore: asFunction(csvBuilder),
  cache: asFunction(cacheBuilder(cacheEngine)),
});

export default container;