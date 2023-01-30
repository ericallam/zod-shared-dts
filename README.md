## Zod Verbose DTS Reproduction

This repo demonstrates a possible issue with Zod: reusing schemas can generate very large `.d.ts` files when built because of the way Zod works.

For example, this code:

```ts
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
```

Produces the following `.d.ts` file:

```ts
import { z } from "zod";

declare const UserSchema: z.ZodObject<
  {
    name: z.ZodString;
    age: z.ZodNumber;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
    age: number;
  },
  {
    name: string;
    age: number;
  }
>;
declare const OrgSchema: z.ZodObject<
  z.extendShape<
    {
      name: z.ZodString;
    },
    {
      members: z.ZodArray<
        z.ZodObject<
          {
            name: z.ZodString;
            age: z.ZodNumber;
          },
          "strip",
          z.ZodTypeAny,
          {
            name: string;
            age: number;
          },
          {
            name: string;
            age: number;
          }
        >,
        "many"
      >;
    }
  >,
  "strip",
  z.ZodTypeAny,
  {
    name: string;
    members: {
      name: string;
      age: number;
    }[];
  },
  {
    name: string;
    members: {
      name: string;
      age: number;
    }[];
  }
>;
declare const RepoSchema: z.ZodObject<
  {
    name: z.ZodString;
    owner: z.ZodObject<
      {
        name: z.ZodString;
        age: z.ZodNumber;
      },
      "strip",
      z.ZodTypeAny,
      {
        name: string;
        age: number;
      },
      {
        name: string;
        age: number;
      }
    >;
    org: z.ZodObject<
      z.extendShape<
        {
          name: z.ZodString;
        },
        {
          members: z.ZodArray<
            z.ZodObject<
              {
                name: z.ZodString;
                age: z.ZodNumber;
              },
              "strip",
              z.ZodTypeAny,
              {
                name: string;
                age: number;
              },
              {
                name: string;
                age: number;
              }
            >,
            "many"
          >;
        }
      >,
      "strip",
      z.ZodTypeAny,
      {
        name: string;
        members: {
          name: string;
          age: number;
        }[];
      },
      {
        name: string;
        members: {
          name: string;
          age: number;
        }[];
      }
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
    owner: {
      name: string;
      age: number;
    };
    org: {
      name: string;
      members: {
        name: string;
        age: number;
      }[];
    };
  },
  {
    name: string;
    owner: {
      name: string;
      age: number;
    };
    org: {
      name: string;
      members: {
        name: string;
        age: number;
      }[];
    };
  }
>;

export { OrgSchema, RepoSchema, UserSchema };
```

As you can see, there is a lot of duplication in the generated code above.

When creating complex schemas this can easily lead to 100k+ line `.d.ts` files and very slow typescript performance.
