export const projectQueryKeys = {
  all: ["projects"] as const,
  lists: () => ["projects", "list"] as const,
  detail: (id: string | number) => ["projects", "detail", id] as const,
};
