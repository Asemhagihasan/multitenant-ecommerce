import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";
import { LoginSchema, RegisterSchema } from "../schema";

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

      const cookies = await getCookies();

      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // sameSite: "none",
        // domain: "",
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

    const cookies = await getCookies();

    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: "/",
      // sameSite: "none",
      // domain: "",
    });

    return data;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();

    cookies.delete(AUTH_COOKIE);
  }),
});
