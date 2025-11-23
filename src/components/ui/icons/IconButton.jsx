import "./IconButton.css";

function IconButton({
  icon: Icon,
  label,
  variant = "default",
  type = "button",
  ...rest
}) {
  const classes = ["icon-btn", `icon-btn--${variant}`].join(" ");

  return (
    <button
      type={type}
      className={classes}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon className="icon-btn__icon" aria-hidden="true" />
    </button>
  );
}

export default IconButton;
