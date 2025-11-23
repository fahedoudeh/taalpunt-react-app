import "./Button.css";

function Button({
  children,
  variant = "primary", // "primary" | "secondary" | "ghost" | "danger" | "accent"
  size = "md", // "sm" | "md" | "lg"
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}) {
  const classes = [
    "tp-btn",
    `tp-btn--${variant}`,
    `tp-btn--${size}`,
    fullWidth ? "tp-btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export default Button;
