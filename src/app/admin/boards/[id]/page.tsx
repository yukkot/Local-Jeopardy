import { AdminBoardScreen } from "@/frontend/screens/AdminBoardScreen";

export default function Page({ params }: { params: { id: string } }) {
  return <AdminBoardScreen boardId={params.id} />;
}
