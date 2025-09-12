import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import SearchFilters, {
  SearchFiltersSkeleton,
} from "./_components/search-filters";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <HydrateClient>
        <Suspense fallback={<SearchFiltersSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrateClient>
      <div className="flex-1 bg-neutral-200">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
