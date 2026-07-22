import { Search, LayoutGrid } from "lucide-react";
import { categories } from "@/constants/data";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";

export function Categories() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page flex flex-col items-center gap-12">
        <SectionHeading eyebrow="Explore" lead="Trending" highlight="Categories" />

        {/* Search */}
        <Reveal className="w-full max-w-xl">
          <form
            className="flex items-center gap-2 rounded-pill border border-line bg-white p-2 shadow-[var(--shadow-card)]"
            role="search"
          >
            <span className="pl-4 text-muted">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="search"
              aria-label="Search courses"
              placeholder="What do you want to learn today?"
              className="h-11 flex-1 bg-transparent px-2 text-ink outline-none placeholder:text-muted"
            />
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>
        </Reveal>

        <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <Reveal key={category.name} delay={i * 0.05}>
              <CategoryCard category={category} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Button href="/courses" variant="outline" size="lg">
            <LayoutGrid className="h-5 w-5" />
            Explore All Subjects
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
