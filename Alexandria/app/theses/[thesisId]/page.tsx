import { AppHeader } from "@/components/layout/app-header";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getThesisById } from "@/lib/services/thesis-service";
import Image from "next/image";
import Link from "next/link";
import DetailsSidebar from "@/components/layout/details-sidebar";

export default async function ThesisDetails({
    params
}: {
    params: Promise<{ thesisId: string }>;
}) {
    const { thesisId } = await params;
    const id = Number(thesisId);

    if (!Number.isInteger(id) || id <= 0) {
        return (
            <main className="h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
                Thesis not found
            </main>
        );
    }

    const [userResult, thesisResult] = await Promise.all([
        getCurrentUser(),
        getThesisById(id),
    ]);

    const role = userResult.data?.role ?? null;

    if (thesisResult.error || !thesisResult.data) {
        return (
            <main className="h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
                Thesis not found
            </main>
        );
    }

    const thesis = thesisResult.data;

    return (
        <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] xl:h-screen xl:overflow-hidden">
            <AppHeader role={role} />
            <div className="grid grid-cols-1 xl:h-[calc(100vh-4rem)] xl:grid-cols-[220px_minmax(0,1fr)_320px]">
                <aside className="hidden border-r border-white/15 px-3 py-4 xl:block">
                    {/* left nav */}
                    <div>
                        <div className="mb-4 text-sm font-semibold text-[var(--color-text-muted)]">Filter</div>

                        <section className="space-y-4 text-xs text-[var(--color-text)]">
                            <div>
                                <div className="mb-2 font-semibold">Year</div>
                                <div className="flex gap-2">
                                    <input className="w-full rounded border border-white/25 bg-transparent px-2 py-1 outline-none" placeholder="From" />
                                    <input className="w-full rounded border border-white/25 bg-transparent px-2 py-1 outline-none" placeholder="To" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 font-semibold">Research Area</div>
                                <div className="space-y-1">
                                    {["AI / ML", "Web Development", "Mobile Development", "Cybersecurity", "IoT", "Data Science"].map((item) => (
                                        <label key={item} className="flex items-center gap-2">
                                        <input type="checkbox" />
                                        <span>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 font-semibold">Department</div>
                                <div className="space-y-1">
                                    {["Computer Science", "Information Technology", "Information Systems"].map((item) => (
                                        <label key={item} className="flex items-center gap-2">
                                        <input type="checkbox" />
                                        <span>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </aside>

                <section className="px-4 py-5 sm:px-6 xl:overflow-y-auto xl:border-r xl:border-white/15 xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* this section contains the back button, title, authors, abstract, keywords/tags, pdf viewer */}

                    <Link href="/home" className="mb-4 inline-block text-blue-400 hover:text-blue-300">
                        ← Back
                    </Link>

                    <h1 className="max-w-7xl text-2xl font-extrabold leading-tight text-[var(--color-text)]">
                        {thesis.title}
                    </h1>

                    <div className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {thesis.authors
                            .filter((author) => author.contribution_role === "author")
                            .map((author) => author.display_name)
                            .join(" • ")} | {thesis.year}
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">Abstract</h2>
                        <p className="mt-2 max-w-7xl text-sm leading-6 text-[var(--color-text-muted)]">
                            {thesis.abstract}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">Keywords</h2>
                        <p className="mt-2 max-w-7xl text-sm leading-6 text-[var(--color-text-muted)]">
                            {/* Tags are here */}
                            {thesis.tags.join(", ")}
                        </p>
                    </div>

                    <div className="mt-6 flex justify-center">
                        {/* PDF viewer will be put here */}
                        <Image
                            src="/placeholder.svg"
                            alt="Article preview"
                            width={1000}
                            height={360}
                        />
                    </div>
                </section>

                <DetailsSidebar thesis={thesis} />
            </div>
        </main>
    )
}
