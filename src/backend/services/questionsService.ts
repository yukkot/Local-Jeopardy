import { supabase } from "@/backend/lib/supabaseClient";

interface QuestionFields {
  value: number;
  prompt: string;
  correct_answer: string;
  media_url?: string | null; // imagen, audio o video (uno solo)
}

interface CreateQuestionInput extends QuestionFields {
  categoryId: string;
}

export async function createQuestion(input: CreateQuestionInput) {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      category_id: input.categoryId,
      value: input.value,
      prompt: input.prompt,
      correct_answer: input.correct_answer,
      media_url: input.media_url ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      data: null,
      error: error?.message ?? "No se pudo crear la pregunta",
    };
  }

  return { data, error: null };
}

export async function updateQuestion(
  questionId: string,
  input: QuestionFields
) {
  const { data, error } = await supabase
    .from("questions")
    .update({
      value: input.value,
      prompt: input.prompt,
      correct_answer: input.correct_answer,
      media_url: input.media_url ?? null,
    })
    .eq("id", questionId)
    .select()
    .single();

  if (error || !data) {
    return {
      data: null,
      error: error?.message ?? "No se pudo actualizar la pregunta",
    };
  }

  return { data, error: null };
}

export async function deleteQuestion(questionId: string) {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  return { error: error?.message ?? null };
}