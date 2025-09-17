interface Porps {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({ params }: Porps) => {
  const { category } = await params;
  return <div>{category}</div>;
};

export default CategoryPage;
