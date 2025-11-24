import { Logger } from '@nestjs/common';

const logger = new Logger('ErrorHandler');

export function handleServiceError(error: unknown, context: string): never {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`${context}: ${message}`);
  throw error instanceof Error ? error : new Error(message);
}
