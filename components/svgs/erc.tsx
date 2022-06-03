export function ErcIcon(props: any) {
  const { size = 24 } = props;
  return (
    <svg width={size} height={size} fill="none">
      <path
        d="M12.14 2l-.135.456v13.226l.134.133 6.14-3.628L12.139 2z"
        fill="#343434"
      />
      <path d="M12.14 2L6 12.187l6.14 3.628V2z" fill="#8C8C8C" />
      <path
        d="M12.14 16.976l-.076.092v4.711l.075.221 6.143-8.651-6.143 3.627z"
        fill="#3C3C3B"
      />
      <path d="M12.14 22v-5.024L6 13.349 12.14 22z" fill="#8C8C8C" />
      <path d="M12.14 15.818l6.139-3.63-6.14-2.79v6.42z" fill="#141414" />
      <path d="M6 12.189l6.14 3.629v-6.42L6 12.188z" fill="#393939" />
    </svg>
  );
}
