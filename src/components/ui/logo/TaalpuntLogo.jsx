export default function TaalpuntLogo({ width = 140, height = 42 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 140 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* "Taal" in Marine Blue - Funky Font */}
      <text
        x="0"
        y="32"
        fontFamily="'Fredoka', 'Baloo 2', 'Nunito', sans-serif"
        fontSize="28"
        fontWeight="700"
        fill="#fefeffff"
        letterSpacing="0"
      >
        Taal
      </text>

      {/* "punt" in Orange - Funky Font - NO SPACE */}
      <text
        x="58"
        y="32"
        fontFamily="'Fredoka', 'Baloo 2', 'Nunito', sans-serif"
        fontSize="28"
        fontWeight="700"
        fill="#FF4500"
        letterSpacing="0"
      >
        punt
      </text>
    </svg>
  );
}
