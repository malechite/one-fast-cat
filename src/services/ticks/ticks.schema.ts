// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { TicksService } from './ticks.class'

// Main data model schema
export const ticksSchema = Type.Object(
  {
    id: Type.Number(),
    sessionId: Type.String(),
    timestamp: Type.Number(),
    raw: Type.Number()
  },
  { $id: 'Ticks', additionalProperties: false }
)
export type Ticks = Static<typeof ticksSchema>
export const ticksValidator = getValidator(ticksSchema, dataValidator)
export const ticksResolver = resolve<Ticks, HookContext<TicksService>>({})

export const ticksExternalResolver = resolve<Ticks, HookContext<TicksService>>({})

// Schema for creating new entries
export const ticksDataSchema = Type.Pick(ticksSchema, ['timestamp'], {
  $id: 'TicksData'
})
export type TicksData = Static<typeof ticksDataSchema>
export const ticksDataValidator = getValidator(ticksDataSchema, dataValidator)
export const ticksDataResolver = resolve<Ticks, HookContext<TicksService>>({})

// Schema for updating existing entries
export const ticksPatchSchema = Type.Partial(ticksSchema, {
  $id: 'TicksPatch'
})
export type TicksPatch = Static<typeof ticksPatchSchema>
export const ticksPatchValidator = getValidator(ticksPatchSchema, dataValidator)
export const ticksPatchResolver = resolve<Ticks, HookContext<TicksService>>({})

// Schema for allowed query properties
export const ticksQueryProperties = Type.Pick(ticksSchema, ['id', 'sessionId', 'timestamp', 'raw'])
export const ticksQuerySchema = Type.Intersect(
  [
    querySyntax(ticksQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type TicksQuery = Static<typeof ticksQuerySchema>
export const ticksQueryValidator = getValidator(ticksQuerySchema, queryValidator)
export const ticksQueryResolver = resolve<TicksQuery, HookContext<TicksService>>({})
