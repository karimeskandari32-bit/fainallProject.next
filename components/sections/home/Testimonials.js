import Link from "next/link";
import { LuQuote } from "react-icons/lu";

import connectToDB from "@/configs/db";
import Comment from "@/models/Comment";
import User from "@/models/User";
import Course from "@/models/Course";

async function getLatestComments(limit = 6) {
  try {
    await connectToDB();

    // مدل‌ها برای populate باید ثبت شده باشن
    void User;
    void Course;

    const comments = await Comment.find({
      isApproved: true,
      isAdminReply: false,
      parentComment: null,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "user", select: "name fullName username" })
      .populate({ path: "course", select: "title slug" })
      .lean();

    return comments.map((c) => ({
      id: String(c._id),
      text: c.text,
      userName:
        c.user?.name || c.user?.fullName || c.user?.username || "کاربر سایت",
      courseTitle: c.course?.title || "",
      courseSlug: c.course?.slug || "",
    }));
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    return [];
  }
}

export default async function Testimonials() {
  const comments = await getLatestComments();

  // اگه نظر تأییدشده‌ای نیست، بخش نمایش داده نمی‌شه
  if (comments.length === 0) return null;

  return (
    <section className="container py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          نظرات دانشجوها
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          تجربه کسانی که دوره‌ها رو دیدن
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comments.map((c) => (
          <figure
            key={c.id}
            className="flex flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <LuQuote className="size-7 text-primary/40" strokeWidth={1.5} />

            <blockquote className="mt-3 line-clamp-5 flex-1 text-sm leading-7 text-foreground/80">
              {c.text}
            </blockquote>

            <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {c.userName.trim().charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.userName}</p>
                {c.courseTitle &&
                  (c.courseSlug ? (
                    <Link
                      href={`/course/${c.courseSlug}`}
                      className="block truncate text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                      دوره {c.courseTitle}
                    </Link>
                  ) : (
                    <p className="truncate text-xs text-muted-foreground">
                      دوره {c.courseTitle}
                    </p>
                  ))}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}