import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createLogger } from "@/utils/logger";
import { ms } from "@/utils/time";

const logger = createLogger("react-query");

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        logger.error(`Query failed [${query.queryHash}]`, error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const key = mutation.options.mutationKey?.join(".") ?? "unknown";
        logger.error(`Mutation failed [${key}]`, error);
      },
    }),
    defaultOptions: {
      queries: {
        // Reduce background refetches on mobile — override per query when data must be fresher.
        staleTime: ms.Min(2),
        gcTime: ms.Day(1),
        retry: 2,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        networkMode: "online",
      },
      mutations: {
        retry: 1,
        networkMode: "online",
      },
    },
  });
