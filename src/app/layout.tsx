import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jeopardy Casero",
  description: "Tablero de preguntas estilo Jeopardy para jugar en grupo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-white min-h-screen">{children}</body>
    </html>
  );
}
