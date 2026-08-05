"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit3, GripVertical, Lightbulb, ListChecks, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LESSON_MAX_LENGTH } from "@/lib/domain/lessons";

function LessonItem({
  id,
  text,
  readOnly,
  onChange,
  onRemove,
}: {
  id: string;
  text: string;
  readOnly: boolean;
  onChange: (text: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="group flex items-center gap-2 rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-bg)] px-3 py-2.5"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="flex-shrink-0 touch-none cursor-grab text-[var(--color-text-muted)] opacity-50 transition-colors hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <GripVertical size={13} aria-hidden />
      </button>
      <div className="min-w-0 flex-1">
        <input
          value={text}
          maxLength={LESSON_MAX_LENGTH}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Lesson learned"
          className="w-full bg-transparent text-sm leading-relaxed text-[var(--color-text)] outline-none"
        />
        <p className="mt-1 text-[10px] tabular-nums text-[var(--color-text-muted)]">
          {text.length} / {LESSON_MAX_LENGTH}
        </p>
      </div>
      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="flex-shrink-0 text-[var(--color-text-muted)] opacity-0 hover:text-[var(--color-danger)] group-hover:opacity-100 group-focus-within:opacity-100"
          aria-label="Remove this lesson"
        >
          <X strokeWidth={2.5} aria-hidden />
        </Button>
      )}
    </div>
  );
}

interface LessonEntry {
  id: string;
  text: string;
}

interface LessonsModalProps {
  value: string[];
  onChange: (lessons: string[]) => void;
  error?: string;
  readOnly?: boolean;
}

export function LessonsModal({
  value,
  onChange,
  error,
  readOnly = false,
}: LessonsModalProps) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<LessonEntry[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function openModal() {
    setEntries(value.map((text) => ({ id: crypto.randomUUID(), text })));
    setInput("");
    setOpen(true);
  }

  function handleDiscard() {
    setOpen(false);
    setInput("");
  }

  function handleSave() {
    onChange(entries.map((entry) => entry.text).filter(Boolean));
    setOpen(false);
    setInput("");
  }

  function addLesson() {
    const text = input.trim();
    if (!text) return;
    setEntries((previous) => [...previous, { id: crypto.randomUUID(), text }]);
    setInput("");
    inputRef.current?.focus();
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addLesson();
    }
  }

  function removeEntry(id: string) {
    setEntries((previous) => previous.filter((entry) => entry.id !== id));
  }

  function updateEntry(id: string, text: string) {
    setEntries((previous) =>
      previous.map((entry) => (entry.id === id ? { ...entry, text } : entry)),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setEntries((previous) => {
      const oldIndex = previous.findIndex((entry) => entry.id === active.id);
      const newIndex = previous.findIndex((entry) => entry.id === over.id);
      return arrayMove(previous, oldIndex, newIndex);
    });
  }

  const hasContent = value.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={cn(
          "group relative w-full rounded-lg border bg-[var(--color-surface)] px-4 py-3.5 text-left transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
          error && !open
            ? "border-[var(--color-danger)]/50"
            : hasContent
              ? "border-[var(--color-separator)] hover:border-[var(--color-separator-mid)]"
              : "border-dashed border-[var(--color-separator)] hover:border-[var(--color-brand-bright)]/40",
        )}
        aria-label={`${hasContent ? "Edit" : "Add"} lessons learned`}
      >
        {hasContent ? (
          <div className="space-y-2">
            <p className="text-[10px] font-medium text-[var(--color-text-muted)]">
              {value.length} lesson{value.length > 1 ? "s" : ""} ·{" "}
              <span className="text-[var(--color-brand-bright)]">
                click to {readOnly ? "view" : "edit"}
              </span>
            </p>
            <ul className="space-y-1">
              {value.slice(0, 3).map((lesson, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-brand-bright)]/40" />
                  <span className="line-clamp-1 text-[var(--color-text)]">{lesson}</span>
                </li>
              ))}
              {value.length > 3 && (
                <li className="pl-3 text-xs text-[var(--color-text-muted)] opacity-70">
                  +{value.length - 3} more…
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[var(--color-placeholder)]">
            <Edit3 size={13} aria-hidden />
            <span className="text-sm">
              {readOnly ? "No lessons learned" : "Click to add lessons learned…"}
            </span>
          </div>
        )}
        <span className="absolute right-3.5 top-3.5 opacity-0 transition-opacity group-hover:opacity-50 group-focus-visible:opacity-50">
          <Edit3 size={13} className="text-[var(--color-text-muted)]" aria-hidden />
        </span>
      </button>

      {error && !open && (
        <p role="alert" className="mt-1 text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDiscard()}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden border-[var(--color-separator)] bg-[var(--color-surface)] p-0 text-[var(--color-text)] sm:max-w-xl"
        >
          <DialogHeader className="border-b border-[var(--color-separator)] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ListChecks size={14} className="text-[var(--color-brand-bright)]" aria-hidden />
                <DialogTitle className="text-sm font-semibold text-[var(--color-text)]">
                  Lessons Learned
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs tabular-nums text-[var(--color-text-muted)] opacity-70">
                  {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDiscard}
                  className="text-[var(--color-placeholder)] hover:text-[var(--color-text)]"
                  aria-label="Discard and close lessons editor"
                >
                  <X aria-hidden />
                </Button>
              </div>
            </div>
            <DialogDescription className="sr-only">
              {readOnly
                ? "Review the lessons learned saved with this thesis."
                : "Add, edit, reorder, or remove lessons learned before saving them to the submission form."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-2 border-b border-[var(--color-separator)] bg-[var(--color-brand)]/5 px-5 py-3">
            <Lightbulb
              size={13}
              className="mt-0.5 flex-shrink-0 text-[var(--color-brand-bright)]"
              aria-hidden
            />
            <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              One clear, actionable insight per entry. Keep it brief and under {LESSON_MAX_LENGTH} characters. Drag the handle to reorder.
            </p>
          </div>

          <div className="max-h-[50vh] flex-1 space-y-2 overflow-y-auto p-5">
            {entries.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={entries.map((entry) => entry.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <LessonItem
                        key={entry.id}
                        id={entry.id}
                        text={entry.text}
                        readOnly={readOnly}
                        onChange={(text) => updateEntry(entry.id, text)}
                        onRemove={() => removeEntry(entry.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {!readOnly && (
              <div className="flex items-center gap-2 rounded-lg border border-[var(--color-separator)] bg-[var(--color-bg)] px-3 py-2 transition-colors focus-within:border-[var(--color-brand-bright)]/30">
                <Plus size={12} className="flex-shrink-0 text-[var(--color-text-muted)] opacity-50" aria-hidden />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a lesson and press Enter to add…"
                  maxLength={LESSON_MAX_LENGTH}
                  className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder-[var(--color-placeholder)]"
                />
                <span className="text-[10px] tabular-nums text-[var(--color-text-muted)]">
                  {input.length} / {LESSON_MAX_LENGTH}
                </span>
                {input.trim() && (
                  <Button
                    type="button"
                    size="xs"
                    onClick={addLesson}
                    className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-bright)]"
                  >
                    Add
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="mx-0 mb-0 border-[var(--color-separator)] bg-transparent">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDiscard}
              className="border border-[var(--color-separator)] text-[var(--color-text-muted)] hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={readOnly ? handleDiscard : handleSave}
              disabled={!readOnly && entries.length === 0}
              className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-bright)]"
            >
              {readOnly ? "Done" : `Save${entries.length > 0 ? ` (${entries.length})` : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
