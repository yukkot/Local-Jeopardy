import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Space_Mono } from "next/font/google";

// Fraunces: tipografia display, le da caracter al titulo y a las categorias.
// Space Mono: tipografia de datos, para valores en $ y puntajes.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-fraunces",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

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
    <html lang="es" className={`${fraunces.variable} ${spaceMono.variable}`}>
      <body className="bg-void text-ink font-mono min-h-screen">
        {children}
      </body>
    </html>
  );
}
