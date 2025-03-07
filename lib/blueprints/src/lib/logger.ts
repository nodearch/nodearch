import { CustomLogger } from '../interfaces';

export const logger: CustomLogger = (msg, location) => {
  console.log(`[${msg}] at ${location}`);
}