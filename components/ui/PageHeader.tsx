type PageHeaderProps = {
  title: string;
  subtitle?: string;
  accent?: boolean;
};

export default function PageHeader({
  title,
  subtitle,
  accent = true,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      {accent ? <div className="page-accent" aria-hidden="true" /> : null}
      <h1 className="page-title">{title}</h1>
      {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
    </header>
  );
}
