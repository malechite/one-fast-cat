// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Ticks, TicksData, TicksPatch, TicksQuery, TicksService } from './ticks.class'

export type { Ticks, TicksData, TicksPatch, TicksQuery }

export type TicksClientService = Pick<TicksService<Params<TicksQuery>>, (typeof ticksMethods)[number]>

export const ticksPath = 'ticks'

export const ticksMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const ticksClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(ticksPath, connection.service(ticksPath), {
    methods: ticksMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [ticksPath]: TicksClientService
  }
}
