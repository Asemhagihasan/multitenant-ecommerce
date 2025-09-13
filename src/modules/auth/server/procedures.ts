import { headers as getHeaders } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { TRPCError } from "@trpc/server";

import { LoginSchema, RegisterSchema } from "../schema";
import { genetateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({
      headers,
    });

    return session;
  }),
  register: baseProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, username } = input;

      const exisingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: username,
          },
        },
      });

      const exisitingUser = exisingData?.docs?.[0];

      if (exisitingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      await ctx.db.create({
        collection: "users",
        data: {
          email,
          username,
          password,
        },
      });

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email,
          password,
        },
      });

      console.log("data", data);

      if (!data?.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      await genetateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
      });

      return data;
    }),
  login: baseProcedure.input(LoginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;

    const data = await ctx.db.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });

    if (!data?.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }

    await genetateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    });

    return data;
  }),
});
