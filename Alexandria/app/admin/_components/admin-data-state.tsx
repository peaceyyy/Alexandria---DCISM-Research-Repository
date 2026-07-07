type AdminDataStateProps = {
  title: string;
  message: string;
};

export function AdminDataState({ title, message }: AdminDataStateProps) {
  return (
    <section
      className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-6"
      role="alert"
    >
      <h2 className="text-base font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-[#969696]">{message}</p>
    </section>
  );
}
