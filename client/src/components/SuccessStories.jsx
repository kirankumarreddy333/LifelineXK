import { Quote } from "lucide-react";
import Card from "./ui/Card";

const stories = [
  {
    name: "Rahul Sharma",
    role: "Donor since 2022",
    location: "Mumbai",
    bloodGroup: "O+",
    quote:
      "I got an emergency notification for a child needing O+ blood. I was at the hospital within 30 minutes. Knowing I helped save a life is an indescribable feeling.",
    initials: "RS",
  },
  {
    name: "Priya Patel",
    role: "Donor since 2023",
    location: "Delhi",
    bloodGroup: "B-",
    quote:
      "LifelineXK made finding rare B- donors effortless when my father needed surgery. The verified badges gave us complete confidence. Forever grateful.",
    initials: "PP",
  },
  {
    name: "Arjun Reddy",
    role: "Blood Recipient",
    location: "Hyderabad",
    bloodGroup: "A+",
    quote:
      "After an accident, I needed blood urgently. Within an hour, two verified donors from LifelineXK arrived. This platform genuinely connects heroes.",
    initials: "AR",
  },
];

function SuccessStories() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stories.map((story, i) => (
        <Card hover key={i} className="flex flex-col p-6">
          <Quote size={28} className="mb-4 text-neutral-200" fill="currentColor" />
          <p className="flex-1 text-sm leading-relaxed text-ink-soft">
            "{story.quote}"
          </p>
          <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
              {story.initials}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{story.name}</p>
              <p className="text-xs text-ink-soft">
                {story.role} • {story.location}
              </p>
            </div>
            <span className="ml-auto rounded-lg bg-neutral-100 px-2 py-1 font-display text-xs font-bold text-ink">
              {story.bloodGroup}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default SuccessStories;

