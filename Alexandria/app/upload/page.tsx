"use client";

import { useState } from "react";
import { submitThesis } from "@/lib/services/submission-service";
import type { SubmitThesisPayload } from "@/lib/services/types";

export default function UploadPage() {
  const [formData, setFormData] = useState<SubmitThesisPayload>({
    title: "",
    abstract: "",
    year: new Date().getFullYear(),
    department: "DCISM",
    research_area: "",
    authors: [{ user_id: null, display_name: "", contribution_role: "author", sort_order: 1 }],
    tags: [],
    publication_date: "",
    publication_link: "",
    conference: "",
    recommendations: "",
    lessons_learned: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await submitThesis(formData);
      if (result.error) {
        throw new Error(result.error.message);
      }
      setSuccess("Thesis submitted successfully!");
      setFormData({
        title: "",
        abstract: "",
        year: new Date().getFullYear(),
        department: "DCISM",
        research_area: "",
        authors: [{ user_id: null, display_name: "", contribution_role: "author", sort_order: 1 }],
        tags: [],
        publication_date: "",
        publication_link: "",
        conference: "",
        recommendations: "",
        lessons_learned: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit thesis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}

      <div>
        <label>Title *</label>
        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Abstract *</label>
        <textarea name="abstract" value={formData.abstract} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Year *</label>
        <input type="number" name="year" value={formData.year} onChange={handleInputChange} min="2000" max="2030" required />
      </div>

      <div>
        <label>Department *</label>
        <select name="department" value={formData.department} onChange={handleInputChange} required>
          <option value="DCISM">DCISM</option>
          <option value="CAS">CAS</option>
          <option value="TC">TC</option>
        </select>
      </div>

      <div>
        <label>Research Area *</label>
        <input type="text" name="research_area" value={formData.research_area} onChange={handleInputChange} required />
      </div>

      <div>
        <label>Author Name *</label>
        <input type="text" value={formData.authors[0].display_name} onChange={(e) => setFormData(prev => ({ ...prev, authors: [{ ...prev.authors[0], display_name: e.target.value }] }))} required />
      </div>

      <div>
        <label>Tags *</label>
        <input type="text" value={formData.tags.join(", ")} onChange={handleTagChange} required />
      </div>

      <div>
        <label>Publication Date</label>
        <input type="date" name="publication_date" value={formData.publication_date} onChange={handleInputChange} />
      </div>

      <div>
        <label>Publication Link</label>
        <input type="url" name="publication_link" value={formData.publication_link} onChange={handleInputChange} />
      </div>

      <div>
        <label>Conference</label>
        <input type="text" name="conference" value={formData.conference} onChange={handleInputChange} />
      </div>

      <div>
        <label>Recommendations</label>
        <textarea name="recommendations" value={formData.recommendations} onChange={handleInputChange} />
      </div>

      <div>
        <label>Lessons Learned</label>
        <textarea name="lessons_learned" value={formData.lessons_learned} onChange={handleInputChange} />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Thesis"}
      </button>
    </form>
  );
}
