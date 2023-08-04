import { RequestContext, VendureEvent } from "@vendure/core";
import { DeployType } from "../types";

/**
 * @description
 * This event is fired when the build is successful and the build result is available.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */

export type DeployPlatformEventInput = {
    platform: DeployType,
    url?: string,
    metadata?: string
}

export class BuildPlatformEvent extends VendureEvent{
  constructor(
    public ctx: RequestContext,
    public input: DeployPlatformEventInput
  ) {
    super();
  }
}