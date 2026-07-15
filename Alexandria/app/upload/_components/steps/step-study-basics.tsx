"use client";

import { useFormContext } from "react-hook-form";
import { type FormValues, DEPARTMENTS, currentCalendarDate } from "@/lib/upload/schema";
import { StepWrapper, Field, FieldError, SelectInput, inputClass } from "./_helpers";
import { DatePicker } from "@/app/upload/_components/date-picker";

export function StepStudyBasics() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();

  const publicationDate = watch("publication_date");

  return (
    <StepWrapper
      title="Study Basics"
      description="The foundational details of your thesis or capstone project."
    >
      {/* Title */}
      <Field label="Study Title" htmlFor="study-title" required>
        <input
          {...register("title")}
          id="study-title"
          type="text"
          placeholder="e.g. A Machine Learning Approach to Predictive Maintenance…"
          className={inputClass(!!errors.title)}
        />
        {errors.title && <FieldError>{errors.title.message}</FieldError>}
      </Field>

      {/* Department + Type of Study — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Department" htmlFor="department" required>
          <SelectInput {...register("department")} id="department" hasError={!!errors.department}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </SelectInput>
          {errors.department && <FieldError>{errors.department.message}</FieldError>}
        </Field>

        <Field label="Type of Study" htmlFor="type_of_study" required>
          <SelectInput {...register("type_of_study")} id="type_of_study" hasError={!!errors.type_of_study}>
            <option value="thesis">Thesis</option>
            <option value="capstone">Capstone</option>
          </SelectInput>
          {errors.type_of_study && (
            <FieldError>{errors.type_of_study.message}</FieldError>
          )}
        </Field>
      </div>

      {/* Publication Date */}
      <Field
        label="Publication Date"
        required
        hint="The date your thesis was presented or formally published."
      >
        <DatePicker
          value={publicationDate}
          onChange={(val) =>
            setValue("publication_date", val, { shouldDirty: true, shouldValidate: true })
          }
          max={currentCalendarDate}
          error={!!errors.publication_date}
        />

        {/* Derived year badge — appears once a valid date is chosen */}
        {publicationDate && !errors.publication_date && (
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] animate-in fade-in duration-200">
            <span className="text-[9px] font-semibold uppercase tracking-widest">Year</span>
            <span className="rounded-md border border-[var(--color-brand-bright)]/20 bg-[var(--color-brand-bright)]/8 px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--color-brand-bright)]">
              {publicationDate.slice(0, 4)}
            </span>
            <span className="text-[var(--color-text-muted)] opacity-50">— automatically derived from date above</span>
          </p>
        )}

        {errors.publication_date && (
          <FieldError>{errors.publication_date.message}</FieldError>
        )}
      </Field>
    </StepWrapper>
  );
}
