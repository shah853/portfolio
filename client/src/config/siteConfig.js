const aboutSections = [
  {
    title: 'My Introduction',
    paragraphs: [
      "Hello, I'm Muhammad Shah, a BS Computer Science student and Full Stack Web Developer passionate about creating beautiful, functional, and user-friendly web applications.",
      'I enjoy working across the frontend and backend, transforming ideas into complete digital experiences using modern web technologies. From designing responsive interfaces to developing server-side functionality and database-driven applications, I aim to build solutions that are reliable, maintainable, and easy to use.',
    ],
  },
  {
    title: 'My Technical Interests',
    paragraphs: [
      'My interest in Artificial Intelligence motivates me to explore intelligent technologies and discover how AI can enhance web applications and help solve real-world problems.',
    ],
  },
  {
    title: 'My Development Approach',
    paragraphs: [
      'I believe in continuous learning, thoughtful design, clean code, and building projects that provide genuine value.',
    ],
  },
  {
    title: 'My Goals',
    paragraphs: [
      'My goal is to grow as a developer, contribute to meaningful projects, collaborate with clients and teams, and create digital products that make a difference.',
    ],
  },
];

const siteConfig = {
  name: 'Muhammad Shah',
  role: 'Full Stack Web Developer',
  headline: 'BS Computer Science Student | Full Stack Web Developer | AI Enthusiast',
  heroIntro:
    'I build modern, responsive, and reliable web applications that combine thoughtful design with powerful functionality. As a BS Computer Science student and Full Stack Web Developer, I enjoy turning ideas into meaningful digital products while exploring how Artificial Intelligence can create smarter digital experiences.',
  tagline: 'BS Computer Science student, Full Stack Web Developer, and AI enthusiast.',
  shortIntro: 'I build responsive interfaces, reliable backend systems, and complete web applications while exploring Artificial Intelligence.',
  profileImage: '/images/shah.jpg.jpeg',
  about: aboutSections.flatMap((section) => section.paragraphs),
  aboutSections,
  email: '',
  github: '',
  linkedin: '',
  location: 'Pakistan',
  resumeUrl: '/resume.pdf',
  highlights: [
    { label: 'Location', value: 'Pakistan' },
    { label: 'Role', value: 'Full Stack Web Developer' },
    { label: 'Focus', value: 'Web Development and AI' },
  ],
};

export const resumeFilename = 'Muhammad-Shah-Full-Stack-Developer-Resume.pdf';

export default siteConfig;
