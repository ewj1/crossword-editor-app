export function Popup({ children, open }) {
  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded bg-white p-4">{children}</div>
      </div>
    )
  );
}
