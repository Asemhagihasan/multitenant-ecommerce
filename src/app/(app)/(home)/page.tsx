import { getQueryClient, trpc } from "@/trpc/server";

const Home = async () => {
  // const categories = await getQueryClient().fetchQuery(
  //   trpc.categories.getMany.queryOptions()
  // );

  return <div className="flex w-full h-full">home</div>;
};

export default Home;
