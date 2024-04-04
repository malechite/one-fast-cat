// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  ticksDataValidator,
  ticksPatchValidator,
  ticksQueryValidator,
  ticksResolver,
  ticksExternalResolver,
  ticksDataResolver,
  ticksPatchResolver,
  ticksQueryResolver
} from './ticks.schema'

import type { Application } from '../../declarations'
import { TicksService, getOptions } from './ticks.class'
import { ticksPath, ticksMethods } from './ticks.shared'
import { batchCreate } from '../../hooks/batchCreate'

export * from './ticks.class'
export * from './ticks.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const ticks = (app: Application) => {
  // Register our service on the Feathers application
  app.use(ticksPath, new TicksService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ticksMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(ticksPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(ticksExternalResolver), schemaHooks.resolveResult(ticksResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(ticksQueryValidator), schemaHooks.resolveQuery(ticksQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(ticksDataValidator), schemaHooks.resolveData(ticksDataResolver), batchCreate()],
      patch: [schemaHooks.validateData(ticksPatchValidator), schemaHooks.resolveData(ticksPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [ticksPath]: TicksService
  }
}
