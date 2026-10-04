import { GameScreen } from "@/frontend/screens/GameScreen";

export default function Page({ params }: { params: { id: string } }) {
  return <GameScreen boardId={params.id} />;
}
