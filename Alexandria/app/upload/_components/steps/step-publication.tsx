"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { type FormValues } from "@/lib/upload/schema";
import { StepWrapper, Field, FieldError, inputClass } from "./_helpers";

export function StepPublication() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();
  const studyType = watch("type_of_study");

  useEffect(() => {
    if (studyType !== "capstone") setValue("deployment_link", "");
  }, [setValue, studyType]);

  return (
    <StepWrapper
      title="Publication Details"
      description="Alexandria only accepts theses that have been publicly presented or published."
    >
      {/* Conference */}
      <Field
        label="Conference"
        required
        hint="The conference, symposium, or event where this thesis was presented."
      >
        <input
          {...register("conference")}
          type="text"
          placeholder="e.g. International Conference on Computer Science 2024"
          className={inputClass(!!errors.conference)}
        />
        {errors.conference && <FieldError>{errors.conference.message}</FieldError>}
      </Field>

      {/* Publication Link */}
      <Field
        label="Publication Link"
        required
        hint="A public URL to the thesis proceedings, journal, or official publication."
      >
        <input
          {...register("publication_link")}
          type="url"
          placeholder="https://…"
          className={inputClass(!!errors.publication_link)}
        />
        {errors.publication_link && (
          <FieldError>{errors.publication_link.message}</FieldError>
        )}
      </Field>

      <div
        className={[
          "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
          studyType === "capstone" ? "mt-5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
        ].join(" ")}
        aria-hidden={studyType !== "capstone"}
      >
        <div className="min-h-0">
          <Field
            label="Deployment Link"
            hint="Optional. A public URL where readers can open the deployed capstone system."
          >
            <input
              {...register("deployment_link")}
              type="url"
              placeholder="https://…"
              disabled={studyType !== "capstone"}
              className={inputClass(!!errors.deployment_link)}
            />
            {errors.deployment_link && <FieldError>{errors.deployment_link.message}</FieldError>}
          </Field>
        </div>
      </div>
    </StepWrapper>
  );
}
