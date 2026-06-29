import Link from "next/link";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
};

export default function EmptyState({
  icon = "🥋",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state-icon" aria-hidden="true">
        {icon}
      </p>
      <h2 className="empty-state-title">{title}</h2>
      {description ? (
        <p className="empty-state-desc">{description}</p>
      ) : null}
      {action ? (
        <Link href={action.href} className="btn-primary mt-2">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
