// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { SessionsService } from './sessions.class'

// Main data model schema
export const sessionsSchema = Type.Object(
  {
    id: Type.String(),
    distance: Type.Number(),
    startTime: Type.String({ format: 'date-time' }), 
    endTime: Type.Optional(Type.String({ format: 'date-time' })),
    duration: Type.Number(),
    averageSpeed: Type.Number(),
    topSpeed: Type.Number(),
    totalNumberOfTicks: Type.Number(),
  },
  { $id: 'Sessions', additionalProperties: false }
)
export type Sessions = Static<typeof sessionsSchema>
export const sessionsValidator = getValidator(sessionsSchema, dataValidator)
export const sessionsResolver = resolve<Sessions, HookContext<SessionsService>>({})

export const sessionsExternalResolver = resolve<Sessions, HookContext<SessionsService>>({})

// Schema for creating new entries
export const sessionsDataSchema = Type.Pick(sessionsSchema, ['id', 'distance', 'startTime', 'endTime', 'duration', 'averageSpeed', 'topSpeed', 'totalNumberOfTicks'], {
  $id: 'SessionsData'
})
export type SessionsData = Static<typeof sessionsDataSchema>
export const sessionsDataValidator = getValidator(sessionsDataSchema, dataValidator)
export const sessionsDataResolver = resolve<Sessions, HookContext<SessionsService>>({})

// Schema for updating existing entries
export const sessionsPatchSchema = Type.Partial(sessionsSchema, {
  $id: 'SessionsPatch'
})
export type SessionsPatch = Static<typeof sessionsPatchSchema>
export const sessionsPatchValidator = getValidator(sessionsPatchSchema, dataValidator)
export const sessionsPatchResolver = resolve<Sessions, HookContext<SessionsService>>({})

// Schema for allowed query properties
export const sessionsQueryProperties = Type.Pick(sessionsSchema, ['id', 'distance', 'startTime', 'endTime', 'duration', 'averageSpeed', 'topSpeed', 'totalNumberOfTicks'])
export const sessionsQuerySchema = Type.Intersect(
  [
    querySyntax(sessionsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SessionsQuery = Static<typeof sessionsQuerySchema>
export const sessionsQueryValidator = getValidator(sessionsQuerySchema, queryValidator)
export const sessionsQueryResolver = resolve<SessionsQuery, HookContext<SessionsService>>({})
