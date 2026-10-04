"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getBoardById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/frontend/lib/apiClient";
import { FileUploadField } from "@/frontend/components/FileUploadField";
import { AdminHeader } from "@/frontend/components/AdminHeader";

interface QuestionSummary {
  id: string;
  value: number;
  prompt: string;
  correct_answer: string | null;
  media_url: string | null;
  answer_media_url: string | null;
}

interface CategoryDetail {
  id: string;
  name: string;
  questions: QuestionSummary[];
}

interface BoardWithCategory {
  id: string;
  name: string;
  categories: CategoryDetail[];
}

function MediaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  return (
    <div>
      <FileUploadField
        label={label}
        accept="image/*,audio/*,video/*"
        value={value}
        onChange={onChange}
      />
      {value && (
        <div className="flex items-center justify-between gap-3 mt-2 bg-panel-deep border border-ink-muted/15 rounded-md px-3 py-2">
          <span className="font-mono text-[10px] text-ink-muted truncate">
            {value.split("/").pop()}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="font-mono text-xs text-ink-muted hover:text-rose transition shrink-0"
          >
            quitar
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminCategoryScreen({
  boardId,
  categoryId,
}: {
  boardId: string;
  categoryId: string;
}) {
  const [board, setBoard] = useState<BoardWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [prompt, setPrompt] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [answerMediaUrl, setAnswerMediaUrl] = useState("");

  async function loadBoard() {
    try {
      const data = await getBoardById(boardId);
      setBoard(data);
    } catch (err: any) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const category = board?.categories.find((c) => c.id === categoryId);

  function resetForm() {
    setEditingQuestionId(null);
    setValue("");
    setPrompt("");
    setCorrectAnswer("");
    setMediaUrl("");
    setAnswerMediaUrl("");
  }

  function startEdit(q: QuestionSummary) {
    setFormError(null);
    setEditingQuestionId(q.id);
    setValue(String(q.value));
    setPrompt(q.prompt);
    setCorrectAnswer(q.correct_answer || "");
    setMediaUrl(q.media_url || "");
    setAnswerMediaUrl(q.answer_media_url || "");
  }

  async function handleDelete(questionId: string) {
    const confirmed = window.confirm(
      "¿Eliminar esta pregunta? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    setListError(null);
    try {
      await deleteQuestion(questionId);
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      questions: cat.questions.filter((q) => q.id !== questionId),
                    }
                  : cat
              ),
            }
          : prev
      );
      if (editingQuestionId === questionId) resetForm();
    } catch (err: any) {
      setListError(err.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!value || !prompt.trim() || !correctAnswer.trim()) {
      setFormError("Completa el valor, la pista y la respuesta correcta.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      value: Number(value),
      prompt: prompt.trim(),
      correct_answer: correctAnswer.trim(),
      media_url: mediaUrl || null,
      answer_media_url: answerMediaUrl || null,
    };

    try {
      if (editingQuestionId) {
        const updated = await updateQuestion(editingQuestionId, payload);
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                categories: prev.categories.map((cat) =>
                  cat.id === categoryId
                    ? {
                        ...cat,
                        questions: cat.questions.map((q) =>
                          q.id === editingQuestionId ? updated : q
                        ),
                      }
                    : cat
                ),
              }
            : prev
        );
      } else {
        const created = await createQuestion(categoryId, payload);
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                categories: prev.categories.map((cat) =>
                  cat.id === categoryId
                    ? { ...cat, questions: [...cat.questions, created] }
                    : cat
                ),
              }
            : prev
        );
      }
      resetForm();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center text-ink-muted font-mono text-sm">
        cargando categoría...
      </main>
    );
  }

  if (!board || !category) {
    return (
      <main className="min-h-screen bg-void flex flex-col items-center justify-center gap-3 text-ink">
        <p className="font-mono text-sm text-ink-muted">
          {loadError || "Categoría no encontrada"}
        </p>
        <Link
          href={`/admin/boards/${boardId}`}
          className="font-mono text-xs text-marigold hover:underline"
        >
          volver al tablero
        </Link>
      </main>
    );
  }

  const sortedQuestions = [...category.questions].sort((a, b) => a.value - b.value);

  return (
    <main className="min-h-screen bg-void text-ink px-6 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <AdminHeader
          backHref={`/admin/boards/${boardId}`}
          backLabel="← volver al tablero"
        />
        <h1 className="font-display font-black text-3xl text-ink mb-1">
          {category.name}
        </h1>
        <p className="font-mono text-sm text-ink-muted mb-8">
          {sortedQuestions.length} pregunta(s) cargada(s)
        </p>

        {listError && (
          <p className="font-mono text-sm text-rose mb-4">{listError}</p>
        )}

        {sortedQuestions.length > 0 && (
          <ul className="flex flex-col gap-2 mb-10">
            {sortedQuestions.map((q) => (
              <li
                key={q.id}
                className={`bg-panel border rounded-lg px-4 py-3 transition ${
                  editingQuestionId === q.id
                    ? "border-marigold"
                    : "border-ink-muted/15"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-marigold">
                    ${q.value}
                  </span>
                  <div className="flex items-center gap-3">
                    {(q.media_url || q.answer_media_url) && (
                      <span className="font-mono text-[10px] text-ink-muted">
                        con archivo
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => startEdit(q)}
                      className="font-mono text-[10px] text-ink-muted hover:text-marigold transition"
                    >
                      editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      className="font-mono text-[10px] text-ink-muted hover:text-rose transition"
                    >
                      eliminar
                    </button>
                  </div>
                </div>
                <p className="font-display text-sm text-ink truncate">
                  {q.prompt}
                </p>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-panel border border-ink-muted/15 rounded-lg p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink">
              {editingQuestionId ? "Editar pregunta" : "Agregar pregunta"}
            </h2>
            {editingQuestionId && (
              <button
                type="button"
                onClick={resetForm}
                className="font-mono text-xs text-ink-muted hover:text-ink transition"
              >
                cancelar edición
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Valor ($)"
              className="w-32 px-3 py-2 bg-panel-deep border border-ink-muted/20 rounded font-mono text-sm text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
            />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Texto de la pista"
              className="flex-1 px-3 py-2 bg-panel-deep border border-ink-muted/20 rounded font-mono text-sm text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-ink-muted block mb-1">
              Respuesta correcta
            </label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Se muestra solo al revelar (se dice en voz alta)"
              className="w-full px-3 py-2 bg-panel-deep border border-ink-muted/20 rounded font-mono text-sm text-ink placeholder-ink-muted/50 focus:outline-none focus:border-marigold/60"
            />
          </div>

          <MediaField
            label="Archivo de la pregunta (opcional: imagen, audio o video)"
            value={mediaUrl}
            onChange={setMediaUrl}
          />

          <MediaField
            label="Archivo de la respuesta (opcional; se muestra al revelar)"
            value={answerMediaUrl}
            onChange={setAnswerMediaUrl}
          />

          {formError && <p className="font-mono text-sm text-rose">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="py-2.5 bg-marigold hover:bg-marigold/85 disabled:opacity-50 text-void font-mono font-bold rounded text-sm transition"
          >
            {saving
              ? "guardando..."
              : editingQuestionId
              ? "Guardar cambios"
              : "Guardar pregunta"}
          </button>
        </form>
      </div>
    </main>
  );
}