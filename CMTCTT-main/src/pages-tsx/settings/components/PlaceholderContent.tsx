interface PlaceholderContentProps {
  title: string;
}

export function PlaceholderContent({ title }: PlaceholderContentProps) {
  return (
    <div className="py-16 text-center text-gray-400 text-sm">{title} — coming soon</div>
  );
}
