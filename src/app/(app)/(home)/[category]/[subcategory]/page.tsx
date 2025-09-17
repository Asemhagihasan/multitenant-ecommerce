interface Porps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

const SubCategoryPage = async ({ params }: Porps) => {
  const { category, subcategory } = await params;
  return (
    <div>
      {category} {subcategory}
    </div>
  );
};

export default SubCategoryPage;
