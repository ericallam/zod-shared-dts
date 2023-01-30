import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const WithMembersSchema = z.object({
  members: z.array(UserSchema),
});

export const OrgSchema = z
  .object({
    name: z.string(),
  })
  .merge(WithMembersSchema);

export const RepoSchema = z.object({
  name: z.string(),
  owner: UserSchema,
  org: OrgSchema,
});
