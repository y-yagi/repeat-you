import type { FC, ReactNode } from "react";

interface AppHeaderProps {
  title?: string;
  description?: ReactNode;
}

const AppHeader: FC<AppHeaderProps> = ({
  title = "YouTube Repeater",
  description,
}) => (
  <header className="app-hero">
    <span className="app-hero__icon" aria-hidden="true">
      ▶
    </span>
    <div className="app-hero__text">
      <h1 className="app-hero__title">{title}</h1>
      {description && (
        <p className="app-hero__description">{description}</p>
      )}
    </div>
  </header>
);

export default AppHeader;
