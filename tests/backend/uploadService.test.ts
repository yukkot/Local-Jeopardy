jest.mock("@/backend/lib/supabaseClient", () => ({
  supabase: {
    storage: {
      from: jest.fn(),
    },
  },
}));

import { supabase } from "@/backend/lib/supabaseClient";
import { uploadMediaFile } from "@/backend/services/uploadService";

function fakeFile(name: string): File {
  return { name } as unknown as File;
}

describe("uploadMediaFile", () => {
  afterEach(() => jest.clearAllMocks());

  it("sube el archivo y devuelve la URL pública", async () => {
    const upload = jest.fn().mockResolvedValueOnce({ error: null });
    const getPublicUrl = jest.fn().mockReturnValueOnce({
      data: {
        publicUrl:
          "https://example.supabase.co/storage/v1/object/public/media/archivo.png",
      },
    });
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload,
      getPublicUrl,
    });

    const result = await uploadMediaFile(fakeFile("archivo.png"));

    expect(upload).toHaveBeenCalled();
    expect(result.error).toBeNull();
    expect(result.url).toBe(
      "https://example.supabase.co/storage/v1/object/public/media/archivo.png"
    );
  });

  it("devuelve el error si la subida falla", async () => {
    const upload = jest
      .fn()
      .mockResolvedValueOnce({ error: { message: "bucket no encontrado" } });
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload,
      getPublicUrl: jest.fn(),
    });

    const result = await uploadMediaFile(fakeFile("clip.mp3"));

    expect(result.url).toBeNull();
    expect(result.error).toBe("bucket no encontrado");
  });
});
