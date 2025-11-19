import { courseMenu } from "../data/content";

function CoursesPage() {
  return (
    <section className="space-y-4" id="courses">
      <div className="flex items-center gap-4">
        <span className="h-px w-24 bg-[#dad5d2]" />
        <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">courses</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {courseMenu.map((course) => (
          <div
            key={course}
            className="rounded-[24px] border border-[#efeded] bg-white p-5 text-sm text-[#4c4c4c] shadow-sm"
          >
            {course}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CoursesPage;
