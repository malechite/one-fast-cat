// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Ticks, TicksData, TicksPatch, TicksQuery } from './ticks.schema'
import { ServiceName } from '../../types'

export type { Ticks, TicksData, TicksPatch, TicksQuery }

export interface TicksParams extends KnexAdapterParams<TicksQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class TicksService<ServiceParams extends Params = TicksParams> extends KnexService<
  Ticks,
  TicksData,
  TicksParams,
  TicksPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: ServiceName.Ticks
  }
}
