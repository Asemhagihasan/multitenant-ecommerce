import z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(63, "Username must be at most 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username must start and end with a letter or number, and can only contain letters, numbers, and hyphens"
    )
    .refine(
      (value) => !value.includes("--"),
      "Username cannot contain consecutive hyphens"
    )
    .transform((username) => username.toLowerCase()),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});
