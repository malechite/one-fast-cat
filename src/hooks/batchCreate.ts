import { HookContext } from "@feathersjs/feathers";

export const batchCreate = () => async (context: HookContext) => {
  if (Array.isArray(context.data)) {
    const batchData = context.data;
    context.result = await Promise.all(
      batchData.map(item => context.service.create(item, context.params))
    );
    // Skipping the original create method since we've already processed the batch
    context.skip = true;
  }
  return context;
};
