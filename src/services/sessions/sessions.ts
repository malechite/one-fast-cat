// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  sessionsDataValidator,
  sessionsPatchValidator,
  sessionsQueryValidator,
  sessionsResolver,
  sessionsExternalResolver,
  sessionsDataResolver,
  sessionsPatchResolver,
  sessionsQueryResolver
} from './sessions.schema'

import type { Application } from '../../declarations'
import { SessionsService, getOptions } from './sessions.class'
import { sessionsPath, sessionsMethods } from './sessions.shared'

export * from './sessions.class'
export * from './sessions.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const sessions = (app: Application) => {
  // Register our service on the Feathers application
  app.use(sessionsPath, new SessionsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: sessionsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(sessionsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(sessionsExternalResolver),
        schemaHooks.resolveResult(sessionsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(sessionsQueryValidator),
        schemaHooks.resolveQuery(sessionsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(sessionsDataValidator),
        schemaHooks.resolveData(sessionsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(sessionsPatchValidator),
        schemaHooks.resolveData(sessionsPatchResolver)
      ],
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
    [sessionsPath]: SessionsService
  }
}
