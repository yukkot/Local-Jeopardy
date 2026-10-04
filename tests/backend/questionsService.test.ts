jest.mock("@/backend/lib/supabaseClient", () => ({
  supabase: { from: jest.fn() },
}));

import { supabase } from "@/backend/lib/supabaseClient";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/backend/services/questionsService";

describe("questionsService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("createQuestion", () => {
    it("crea la pregunta con su archivo multimedia", async () => {
      const single = jest.fn().mockResolvedValueOnce({
        data: { id: "q-1", value: 200, prompt: "p", correct_answer: "Chile", media_url: "http://a.png" },
        error: null,
      });
      const select = jest.fn(() => ({ single }));
      const insert = jest.fn(() => ({ select }));
      (supabase.from as jest.Mock).mockReturnValueOnce({ insert });

      const result = await createQuestion({
        categoryId: "cat-1",
        value: 200,
        prompt: "p",
        correct_answer: "Chile",
        media_url: "http://a.png",
      });

      expect(insert).toHaveBeenCalledWith({
        category_id: "cat-1",
        value: 200,
        prompt: "p",
        correct_answer: "Chile",
        media_url: "http://a.png",
      });
      expect(result.error).toBeNull();
      expect(result.data?.id).toBe("q-1");
    });

    it("guarda media_url como null si no se envia archivo", async () => {
      const single = jest.fn().mockResolvedValueOnce({
        data: { id: "q-2" },
        error: null,
      });
      const select = jest.fn(() => ({ single }));
      const insert = jest.fn(() => ({ select }));
      (supabase.from as jest.Mock).mockReturnValueOnce({ insert });

      await createQuestion({
        categoryId: "cat-1",
        value: 100,
        prompt: "p",
        correct_answer: "X",
      });

      expect(insert).toHaveBeenCalledWith(
        expect.objectContaining({ media_url: null })
      );
    });

    it("devuelve error si Supabase falla", async () => {
      const single = jest.fn().mockResolvedValueOnce({
        data: null,
        error: { message: "category_id invalido" },
      });
      const select = jest.fn(() => ({ single }));
      const insert = jest.fn(() => ({ select }));
      (supabase.from as jest.Mock).mockReturnValueOnce({ insert });

      const result = await createQuestion({
        categoryId: "x",
        value: 200,
        prompt: "p",
        correct_answer: "Chile",
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe("category_id invalido");
    });
  });

  describe("updateQuestion", () => {
    it("actualiza la pregunta y devuelve el registro", async () => {
      const single = jest.fn().mockResolvedValueOnce({
        data: { id: "q-1", value: 300, prompt: "nueva", correct_answer: "Z", media_url: null },
        error: null,
      });
      const select = jest.fn(() => ({ single }));
      const eq = jest.fn(() => ({ select }));
      const update = jest.fn(() => ({ eq }));
      (supabase.from as jest.Mock).mockReturnValueOnce({ update });

      const result = await updateQuestion("q-1", {
        value: 300,
        prompt: "nueva",
        correct_answer: "Z",
      });

      expect(eq).toHaveBeenCalledWith("id", "q-1");
      expect(result.error).toBeNull();
      expect(result.data?.value).toBe(300);
    });

    it("devuelve error si Supabase falla", async () => {
      const single = jest.fn().mockResolvedValueOnce({
        data: null,
        error: { message: "id invalido" },
      });
      const select = jest.fn(() => ({ single }));
      const eq = jest.fn(() => ({ select }));
      const update = jest.fn(() => ({ eq }));
      (supabase.from as jest.Mock).mockReturnValueOnce({ update });

      const result = await updateQuestion("x", {
        value: 100,
        prompt: "p",
        correct_answer: "Y",
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe("id invalido");
    });
  });

  describe("deleteQuestion", () => {
    it("elimina la pregunta sin error", async () => {
      const eq = jest.fn().mockResolvedValueOnce({ error: null });
      const del = jest.fn(() => ({ eq }));
      (supabase.from as jest.Mock).mockReturnValueOnce({ delete: del });

      const result = await deleteQuestion("q-1");

      expect(del).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it("devuelve el error si la eliminacion falla", async () => {
      const eq = jest
        .fn()
        .mockResolvedValueOnce({ error: { message: "no se pudo borrar" } });
      const del = jest.fn(() => ({ eq }));
      (supabase.from as jest.Mock).mockReturnValueOnce({ delete: del });

      const result = await deleteQuestion("q-1");

      expect(result.error).toBe("no se pudo borrar");
    });
  });
});