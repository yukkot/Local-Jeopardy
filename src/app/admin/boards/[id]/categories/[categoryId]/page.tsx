import { AdminCategoryScreen } from "@/frontend/screens/AdminCategoryScreen";

export default function Page({
  params,
}: {
  params: { id: string; categoryId: string };
}) {
  return (
    <AdminCategoryScreen boardId={params.id} categoryId={params.categoryId} />
  );
}
