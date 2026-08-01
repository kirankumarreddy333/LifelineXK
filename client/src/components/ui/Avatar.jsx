import { User } from "lucide-react";

function Avatar({ src, alt = "avatar", size = 40, className = "" }) {
  const sizeCls = {
    32: "h-8 w-8",
    40: "h-10 w-10",
    48: "h-12 w-12",
    56: "h-14 w-14",
    64: "h-16 w-16",
    96: "h-24 w-24",
    128: "h-32 w-32",
  }[size];

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400 ${sizeCls} ${className}`}
      >
        <User size={size * 0.45} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ring-2 ring-line ${sizeCls} ${className}`}
    />
  );
}

export default Avatar;

