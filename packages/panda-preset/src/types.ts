export type BorderRadius = (typeof BorderRadii)[number];
export const BorderRadii = ["none", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;
