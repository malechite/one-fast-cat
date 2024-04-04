// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Sessions, SessionsData, SessionsPatch, SessionsQuery } from './sessions.schema'
import { ServiceName } from '../../types'

export type { Sessions, SessionsData, SessionsPatch, SessionsQuery }

export interface SessionsParams extends KnexAdapterParams<SessionsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class SessionsService<ServiceParams extends Params = SessionsParams> extends KnexService<
  Sessions,
  SessionsData,
  SessionsParams,
  SessionsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: ServiceName.Sessions
  }
}
