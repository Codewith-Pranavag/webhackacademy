/** Demo content modelled on the NextLearn template, rebranded for WebHack Academy. */

export type Course = {
  slug: string;
  title: string;
  category: string;
  image: string;
  price: string;
  lessons: number;
  students: string;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  date: string;
};

export const courses: Course[] = [
  {
    slug: "product-design",
    title: "Product Design Masterclass",
    category: "Design",
    image: "/images/80ed5538-nextlearn-course-image-1.jpg",
    price: "Free",
    lessons: 24,
    students: "1.2k",
    rating: 4.9,
    level: "Beginner",
    date: "28 Mar 24",
  },
  {
    slug: "branding-design",
    title: "Branding & Identity Design",
    category: "Design",
    image: "/images/44c8f23c-nextlearn-course-image-2.jpg",
    price: "Free",
    lessons: 18,
    students: "980",
    rating: 4.8,
    level: "Intermediate",
    date: "28 Mar 24",
  },
  {
    slug: "3d-motion-design",
    title: "3D Motion Design in Blender",
    category: "Motion",
    image: "/images/d474de99-nextlearn-course-image-3.jpg",
    price: "Free",
    lessons: 32,
    students: "2.4k",
    rating: 5.0,
    level: "Advanced",
    date: "28 Mar 24",
  },
  {
    slug: "fullstack-web",
    title: "Full-Stack Web Development",
    category: "Development",
    image: "/images/e96e471f-nextlearn-course-image-4.jpg",
    price: "$49",
    lessons: 56,
    students: "5.1k",
    rating: 4.9,
    level: "Intermediate",
    date: "12 Apr 24",
  },
  {
    slug: "data-science",
    title: "Data Science with Python",
    category: "Data",
    image: "/images/7ea5fc0d-nextlearn-course-image-5.jpg",
    price: "$59",
    lessons: 44,
    students: "3.7k",
    rating: 4.8,
    level: "Intermediate",
    date: "02 May 24",
  },
  {
    slug: "cybersecurity",
    title: "Ethical Hacking & Security",
    category: "Security",
    image: "/images/48d52d11-nextlearn-course-image-6.jpg",
    price: "$69",
    lessons: 38,
    students: "2.9k",
    rating: 4.9,
    level: "Advanced",
    date: "18 May 24",
  },
];

export type Category = {
  name: string;
  icon: string;
  courses: number;
};

export const categories: Category[] = [
  { name: "Computer Science", icon: "/images/6889e9f2-nextline-icon-01.png", courses: 42 },
  { name: "Engineering", icon: "/images/96763913-nextline-icon-02.png", courses: 28 },
  { name: "Music Lessons", icon: "/images/29fc775c-nextline-icon-03.png", courses: 19 },
  { name: "Writing & Reading", icon: "/images/64c67d06-nextline-icon-04.png", courses: 24 },
  { name: "Foreign Languages", icon: "/images/8aaea44c-nextline-info-icon-01.png", courses: 31 },
  { name: "History", icon: "/images/01e3fe09-nextline-info-icon-02.png", courses: 15 },
  { name: "Content Writing", icon: "/images/675252aa-nextline-info-icon-03.png", courses: 22 },
  { name: "Business", icon: "/images/836d744a-nextline-info-icon-04.png", courses: 36 },
  { name: "Marketing", icon: "/images/2d3913d6-nextline-info-icon-05.png", courses: 27 },
];

export type Mentor = {
  name: string;
  role: string;
  image: string;
};

export const mentors: Mentor[] = [
  { name: "Alicia Moreno", role: "Product Design Lead", image: "/images/cd5b8318-nestlearn-rectangle-39823.jpg" },
  { name: "David Okafor", role: "Senior Engineer", image: "/images/486c4179-nestlearn-rectangle-39823-1.jpg" },
  { name: "Priya Sharma", role: "Data Scientist", image: "/images/3a1d96ca-nestlearn-rectangle-39823-2.jpg" },
  { name: "Marco Rossi", role: "Motion Designer", image: "/images/80ed5538-nextlearn-course-image-1.jpg" },
  { name: "Sofia Lindqvist", role: "Security Researcher", image: "/images/44c8f23c-nextlearn-course-image-2.jpg" },
  { name: "James Carter", role: "Full-Stack Mentor", image: "/images/d474de99-nextlearn-course-image-3.jpg" },
  { name: "Nadia Rahman", role: "Brand Strategist", image: "/images/e96e471f-nextlearn-course-image-4.jpg" },
  { name: "Liam O'Brien", role: "ML Engineer", image: "/images/7ea5fc0d-nextlearn-course-image-5.jpg" },
];

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    name: "Mark Wood",
    role: "UX Designer",
    avatar: "/images/cd5b8318-nestlearn-rectangle-39823.jpg",
    quote:
      "This is one of the best platforms where a person can learn from any domain and any field. The mentors are world-class.",
    rating: 5,
  },
  {
    name: "Elena Petrova",
    role: "Frontend Developer",
    avatar: "/images/486c4179-nestlearn-rectangle-39823-1.jpg",
    quote:
      "The real-time courses completely changed how I learn. I went from beginner to shipping production code in months.",
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    role: "Data Analyst",
    avatar: "/images/3a1d96ca-nestlearn-rectangle-39823-2.jpg",
    quote:
      "Practical, hands-on, and genuinely enjoyable. WebHack Academy is worth every minute I've spent here.",
    rating: 5,
  },
  {
    name: "Yuki Tanaka",
    role: "Product Manager",
    avatar: "/images/e96e471f-nextlearn-course-image-4.jpg",
    quote:
      "A growing library of resources I can implement immediately into my workflow. Highly recommended.",
    rating: 5,
  },
];

export const partners: string[] = [
  "/images/e7d8ab2a-nextline-logoslider-01.png",
  "/images/2823a73f-nextline-logoslider-02.png",
  "/images/95b4ea17-nextline-logoslider-03.png",
  "/images/79eaf911-nextline-logoslider-04.png",
  "/images/3980f4c9-nextline-logoslider-05.png",
  "/images/82978d7d-nextline-logoslider-06.png",
  "/images/f5c04266-nextline-logoslider-07.png",
  "/images/931c1f68-nextline-logoslider-08.png",
  "/images/442479cf-nextline-logoslider-09.png",
  "/images/9f7bada7-nextline-logoslider-10.png",
  "/images/30909965-nextline-logoslider-11.png",
  "/images/53fb028c-nextline-logoslider-12.png",
];

export type Leader = {
  name: string;
  role: string;
  image: string;
};

export const leadership: Leader[] = [
  { name: "John Doe", role: "Chief Executive Officer", image: "/images/cd5b8318-nestlearn-rectangle-39823.jpg" },
  { name: "Jane Doe", role: "Chief Technology Officer", image: "/images/486c4179-nestlearn-rectangle-39823-1.jpg" },
  { name: "Bob Smith", role: "Director of Instruction", image: "/images/3a1d96ca-nestlearn-rectangle-39823-2.jpg" },
];

export const stats = [
  { value: 2000, suffix: "+", label: "Expert Mentors" },
  { value: 213, suffix: "k", label: "Video Courses" },
  { value: 200, suffix: "+", label: "Partner Institutions" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];
