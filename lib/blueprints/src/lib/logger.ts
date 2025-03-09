import { TLogger } from '../interfaces';

export const logger: TLogger = (msg, location) => {
  console.log(`[${msg}] at ${location}`);
}