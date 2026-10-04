jest.mock("@/backend/lib/supabaseClient", () => ({
  supabase: { from: jest.fn() },
}));

import { supabase } from "@/backend/lib/supabaseClient";
import { createCategory } from "@/backend/services/categoriesService";

describe("categoriesService", () => {
  afterEach(() => jest.clearAllMocks());

  it("createCategory inserta la categoria y devuelve el registro creado", async () => {
    const single = jest.fn().mockResolvedValueOnce({
      data: { id: "cat-1", board_id: "board-1", name: "Categoria A", position: 1 },
      error: null,
    });
    const select = jest.fn(() => ({ single }));
    const insert = jest.fn(() => ({ select }));
    (supabase.from as jest.Mock).mockReturnValueOnce({ insert });

    const result = await createCategory("board-1", "Categoria A", 1);

    expect(insert).toHaveBeenCalledWith({
      board_id: "board-1",
      name: "Categoria A",
      position: 1,
    });
    expect(result.data?.id).toBe("cat-1");
    expect(result.error).toBeNull();
  });

  it("createCategory devuelve el mensaje de error si Supabase falla", async () => {
    const single = jest.fn().mockResolvedValueOnce({
      data: null,
      error: { message: "board_id invalido" },
    });
    const select = jest.fn(() => ({ single }));
    const insert = jest.fn(() => ({ select }));
    (supabase.from as jest.Mock).mockReturnValueOnce({ insert });

    const result = await createCategory("board-invalido", "X", 1);

    expect(result.data).toBeNull();
    expect(result.error).toBe("board_id invalido");
  });
});
