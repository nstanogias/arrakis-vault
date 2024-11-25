export default function VaultPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col h-full mb-auto">{children}</div>;
}
