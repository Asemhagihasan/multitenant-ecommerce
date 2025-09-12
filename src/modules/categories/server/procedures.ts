import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      pagination: false,
      depth: 1,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formatedData = data?.docs?.map((doc) => ({
      ...doc,
      subCategories: (doc?.subCategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
        subCategories: undefined,
      })),
    }));

    return formatedData;
  }),
});
