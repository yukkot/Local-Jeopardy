jest.mock("@/backend/lib/supabaseClient", () => ({
  supabase: { from: jest.fn() },
}));

import { supabase } from "@/backend/lib/supabaseClient";
import {
  listBoards,
  createBoard,
  getBoardWithDetails,
} from "@/backend/services/boardsService";

describe("boardsService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listBoards devuelve los tableros cuando Supabase responde bien", async () => {
    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({
        data: [{ id: "1", name: "Tablero de prueba" }],
        error: null,
      }),
    });

    const result = await listBoards();

    expect(result.data).toEqual([{ id: "1", name: "Tablero de prueba" }]);
    expect(result.error).toBeNull();
  });

  it("listBoards devuelve el mensaje de error si Supabase falla", async () => {
    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({
        data: null,
        error: { message: "fallo de conexion" },
      }),
    });

    const result = await listBoards();

    expect(result.data).toBeNull();
    expect(result.error).toBe("fallo de conexion");
  });

  it("createBoard inserta el tablero y devuelve el registro creado", async () => {
    const single = jest.fn().mockResolvedValueOnce({
      data: { id: "2", name: "Nuevo tablero" },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const insert = jest.fn(() => ({ select }));
    (supabase.from as jest.Mock).mockReturnValueOnce({ insert });

    const result = await createBoard("Nuevo tablero");

    expect(insert).toHaveBeenCalledWith({ name: "Nuevo tablero" });
    expect(result.data).toEqual({ id: "2", name: "Nuevo tablero" });
    expect(result.error).toBeNull();
  });

  it("getBoardWithDetails ordena categorias y preguntas por posicion/valor", async () => {
    const single = jest.fn().mockResolvedValueOnce({
      data: {
        id: "3",
        name: "Tablero completo",
        categories: [
          {
            id: "cat-2",
            name: "Categoria B",
            position: 2,
            questions: [
              { id: "q2", value: 400, prompt: "p2", media_url: null },
              { id: "q1", value: 200, prompt: "p1", media_url: "http://a.png" },
            ],
          },
          {
            id: "cat-1",
            name: "Categoria A",
            position: 1,
            questions: [],
          },
        ],
      },
      error: null,
    });
    const eq = jest.fn(() => ({ single }));
    const select = jest.fn(() => ({ eq }));
    (supabase.from as jest.Mock).mockReturnValueOnce({ select });

    const result = await getBoardWithDetails("3");

    expect(result.error).toBeNull();
    expect(result.data?.categories[0].id).toBe("cat-1");
    expect(result.data?.categories[1].questions[0].id).toBe("q1");
  });

  it("getBoardWithDetails devuelve error si el tablero no existe", async () => {
    const single = jest.fn().mockResolvedValueOnce({
      data: null,
      error: null,
    });
    const eq = jest.fn(() => ({ single }));
    const select = jest.fn(() => ({ eq }));
    (supabase.from as jest.Mock).mockReturnValueOnce({ select });

    const result = await getBoardWithDetails("no-existe");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Tablero no encontrado");
  });
});