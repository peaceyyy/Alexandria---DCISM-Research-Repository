"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitThesis } from "@/lib/services/submission-service";
import { validateThesisPdf } from "@/lib/upload/file-validation";

const APPLICATION_TIME_ZONE = "Asia/Manila";

function getCurrentCalendarDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APPLICATION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

const currentCalendarDate = getCurrentCalendarDate();

const authorSchema = z.object({
  user_id: z.string().nullable(),
  display_name: z.string().min(2, "Name is required"),
  contribution_role: z.string().min(1),
  sort_order: z.number().min(1),
});

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  abstract: z.string().min(50, "Abstract must be at least 50 characters"),
  department: z.string().min(1),
  research_area: z.string().min(1),
  authors: z.array(authorSchema).min(1, "At least one author is required"),
  tags: z.string().min(1, "At least one tag is required"),
  publication_date: z.iso.date("Publication date is required"),
  publication_link: z.string().optional().or(z.literal("")),
  conference: z.string().optional(),
  recommendations: z.string().optional(),
  lessons_learned: z.string().optional(),
}).superRefine((data, context) => {
  if (!data.publication_date) {
    return;
  }

  if (data.publication_date > currentCalendarDate) {
    context.addIssue({
      code: "custom",
      path: ["publication_date"],
      message: "Publication date cannot be later than today",
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      abstract: "",
      department: "DCISM",
      research_area: "",
      authors: [
        {
          user_id: null,
          display_name: "",
          contribution_role: "author",
          sort_order: 1,
        },
      ],
      tags: "",
      publication_date: "",
      publication_link: "",
      conference: "",
      recommendations: "",
      lessons_learned: "",
    },
  });

  const {
    fields: authorFields,
    append: appendAuthor,
    remove: removeAuthor,
  } = useFieldArray({
    name: "authors",
    control,
  });

  const fillDummyData = () => {
    setValue("title", "Test Thesis " + Math.floor(Math.random() * 1000));
    setValue("abstract", "This is a mock abstract that is intentionally longer than 50 characters to ensure it passes the Zod validation schema successfully during our testing.");
    setValue("department", "DCISM");
    setValue("research_area", "Artificial Intelligence");
    setValue("tags", "test, mock, ai");
    setValue("authors.0.display_name", "Test User");
    setValue("authors.0.contribution_role", "author");
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!selectedFile) {
        throw new Error(
          "Please attach a thesis PDF before submitting.",
        );
      }

      const fileValidationError = await validateThesisPdf(selectedFile);
      if (fileValidationError) {
        throw new Error(fileValidationError);
      }

      const payload = {
        ...data,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        publication_link: data.publication_link || undefined,
        conference: data.conference || undefined,
        recommendations: data.recommendations || undefined,
        lessons_learned: data.lessons_learned || undefined,
      };

      const submissionPacket = new FormData();
      submissionPacket.set("payload", JSON.stringify(payload));
      submissionPacket.set("file", selectedFile);

      const result = await submitThesis(submissionPacket);
      if (result.error) {
        throw new Error(
          result.error.message || "Failed to create thesis record",
        );
      }

      setSuccess(
        "Thesis and file submitted successfully! Your submission is now in review.",
      );
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Submit Your Thesis</h1>
        <button 
          type="button" 
          onClick={fillDummyData}
          style={{ padding: "8px 16px", background: "#333", color: "white", borderRadius: "4px", cursor: "pointer" }}
        >
          Fill Dummy Data
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}

        <div>
          <h2>Basic Details</h2>

          <div>
            <label>Title *</label>
            <br />
            <input {...register("title")} />
            {errors.title && (
              <p style={{ color: "red" }}>{errors.title.message}</p>
            )}
          </div>

          <br />

          <div>
            <label>Abstract *</label>
            <br />
            <textarea {...register("abstract")} rows={4} />
            {errors.abstract && (
              <p style={{ color: "red" }}>{errors.abstract.message}</p>
            )}
          </div>

          <br />

          <div>
            <label>Department *</label>
            <br />
            <select {...register("department")}>
              <option value="DCISM">DCISM</option>
              <option value="CAS">CAS</option>
              <option value="TC">TC</option>
            </select>
            {errors.department && (
              <p style={{ color: "red" }}>{errors.department.message}</p>
            )}
          </div>

          <br />

          <div>
            <label>Research Area *</label>
            <br />
            <input {...register("research_area")} />
            {errors.research_area && (
              <p style={{ color: "red" }}>{errors.research_area.message}</p>
            )}
          </div>

          <br />

          <div>
            <label>Tags * (comma separated)</label>
            <br />
            <input {...register("tags")} placeholder="e.g. AI, Web" />
            {errors.tags && (
              <p style={{ color: "red" }}>{errors.tags.message}</p>
            )}
          </div>
        </div>

        <br />
        <hr />
        <br />

        <div>
          <h2>Authors & Advisers</h2>
          <button
            type="button"
            onClick={() =>
              appendAuthor({
                user_id: null,
                display_name: "",
                contribution_role: "author",
                sort_order: authorFields.length + 1,
              })
            }
          >
            + Add Person
          </button>

          {authorFields.map((field, index) => (
            <div
              key={field.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <div>
                <label>Name *</label>
                <br />
                <input {...register(`authors.${index}.display_name`)} />
                {errors.authors?.[index]?.display_name && (
                  <p style={{ color: "red" }}>
                    {errors.authors[index]?.display_name?.message}
                  </p>
                )}
              </div>

              <br />

              <div>
                <label>Role *</label>
                <br />
                <select {...register(`authors.${index}.contribution_role`)}>
                  <option value="author">Author</option>
                  <option value="adviser">Adviser</option>
                </select>
              </div>

              <input
                type="hidden"
                {...register(`authors.${index}.sort_order`)}
              />

              <br />

              <button
                type="button"
                onClick={() => removeAuthor(index)}
                disabled={authorFields.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          {errors.authors && !Array.isArray(errors.authors) && (
            <p style={{ color: "red" }}>{errors.authors.message}</p>
          )}
        </div>

        <br />
        <hr />
        <br />

        <div>
          <h2>File Upload</h2>
          <div>
            <label>Upload Thesis PDF Document *</label>
            <br />
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={async (event) => {
                const input = event.currentTarget;
                const file = input.files?.[0] ?? null;

                if (!file) {
                  setSelectedFile(null);
                  return;
                }

                const validationError = await validateThesisPdf(file);
                if (validationError) {
                  setSelectedFile(null);
                  setError(validationError);
                  input.value = "";
                  return;
                }

                setError(null);
                setSelectedFile(file);
              }}
            />
            {!selectedFile && <p>PDF only. Maximum file size 10 MiB.</p>}
            {selectedFile && (
              <p style={{ color: "green" }}>Selected: {selectedFile.name}</p>
            )}
          </div>
        </div>

        <br />
        <hr />
        <br />

        <div>
          <h2>Publication Details & Optional Metadata</h2>

          <div>
            <label>Publication Date *</label>
            <br />
            <input
              type="date"
              max={currentCalendarDate}
              {...register("publication_date")}
            />
            {errors.publication_date && (
              <p style={{ color: "red" }}>
                {errors.publication_date.message}
              </p>
            )}
          </div>

          <br />

          <div>
            <label>Publication Link</label>
            <br />
            <input
              type="text"
              placeholder="https://..."
              {...register("publication_link")}
            />
            {errors.publication_link && (
              <p style={{ color: "red" }}>{errors.publication_link.message}</p>
            )}
          </div>

          <br />

          <div>
            <label>Conference</label>
            <br />
            <input {...register("conference")} />
          </div>

          <br />

          <div>
            <label>Recommendations</label>
            <br />
            <textarea {...register("recommendations")} rows={3} />
          </div>

          <br />

          <div>
            <label>Lessons Learned</label>
            <br />
            <textarea {...register("lessons_learned")} rows={3} />
          </div>
        </div>

        <br />
        <hr />
        <br />

        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting Securely..." : "Submit Thesis"}
          </button>
        </div>
      </form>
    </div>
  );
}
