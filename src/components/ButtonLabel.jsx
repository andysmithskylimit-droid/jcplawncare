/** Two stacked copies of the label; CSS rolls the second into place on hover. */
export default function ButtonLabel({ children }) {
  return (
    <span className="btn__label">
      <span className="btn__text">{children}</span>
      <span className="btn__text btn__text--clone" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
