import { highlighter, logger } from "@/src/utils/logger"
import { z } from "zod"

export function handleError(error: unknown) {
  logger.error(
    `Something went wrong. Please check the error below for more details.`
  )
  logger.error(`If the problem persists, please open an issue on GitHub.`)
  logger.error("")
  if (typeof error === "string") {
    logger.error(error)
    logger.break()
    process.exit(1)
  }

  if (error instanceof z.ZodError) {
    logger.error("Validation failed:")
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      logger.error(`- ${highlighter.info(key)}: ${value}`)
    }
    logger.break()
    process.exit(1)
  }

  if (error instanceof Error) {
    logger.error(error.message)
    logger.break()
    process.exit(1)
  }

  logger.break()
  process.exit(1)
}

export const ERRORS = {
  MISSING_DIR_OR_EMPTY_PIPE: "1",
  EXISTING_CONFIG: "2",
  MISSING_CONFIG: "3",
  FAILED_CONFIG_READ: "4",
  COMPONENT_NOT_FOUND: "5",
  BUILD_MISSING_REGISTRY_FILE: "6"
} as const