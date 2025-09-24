import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import z from "zod";
import { sortValues } from "../search-params";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        price: {},
      };
      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "-createdAt";
      }

      if (input.sort === "trending") {
        sort = "name";
      }

      if (input.sort === "hot_and_new") {
        sort = "+createdAt";
      }

      if (input.minPrice) {
        where.price = {
          ...where.price,
          greater_than_equal: Number(input.minPrice),
        };
      }

      if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: Number(input.maxPrice),
        };
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          pagination: false,
          limit: 1,
          depth: 1,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formatedData = categoriesData?.docs?.map((doc) => ({
          ...doc,
          subCategories: (doc?.subCategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subCategories: undefined,
          })),
        }));

        const subCategoriesSlugs = [];
        const parentCategory = formatedData[0];

        if (parentCategory) {
          subCategoriesSlugs.push(
            ...parentCategory.subCategories.map(
              (subCategory) => subCategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subCategoriesSlugs],
          };
        }
      } else {
        return { docs: [], totalDocs: 0 };
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1,
        where,
        sort,
      });

      return data;
    }),
});
