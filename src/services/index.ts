import { sessions } from './sessions/sessions'
import { ticks } from './ticks/ticks'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(sessions)
  app.configure(ticks)
  // All services will be registered here
}
