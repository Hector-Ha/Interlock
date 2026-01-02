export function MobileSidebar({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-white z-50 p-4">Mobile Sidebar Stub</div>
  );
}
