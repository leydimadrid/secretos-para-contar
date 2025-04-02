interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className="bg-[#002847] text-white px-4 py-2 rounded flex items-center"
      >
        {text}
      </button>
    </div>
  );
}
