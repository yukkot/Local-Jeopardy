describe("supabaseClient", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: "https://xyzexample.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "fake-anon-key-for-testing",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("debe instanciar el cliente de Supabase correctamente", () => {
    const { supabase } = require("@/lib/supabaseClient");
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe("function");
  });
});