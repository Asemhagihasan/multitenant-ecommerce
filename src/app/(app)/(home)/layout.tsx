import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import SearchFilters from "./_components/search-filters";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Category } from "@/payload-types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    pagination: false,
    depth: 1,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formatedData = data?.docs?.map((doc) => ({
    ...doc,
    subCategories: (doc?.subCategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subCategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <SearchFilters data={formatedData} />
      <div className="flex-1 bg-neutral-200">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
