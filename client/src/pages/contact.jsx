import { Navbar } from "../components/navbar";

export default function Contact() {
  const teamMembers = [
    {
      id: 1,
      name: "Ankit Prajapati",
      role: "Front-End Developer & Team Lead",
      bio: "Passionate about creating seamless user experiences and scalable backend solutions.",
      image:
        "https://res.cloudinary.com/dsplnfii2/image/upload/v1763131532/ankit_p9gr0c.jpg",
      github: "https://github.com/creator-9",
      linkedin: "https://www.linkedin.com/in/ankit-prajapati-a490a6360/",
    },
    {
      id: 2,
      name: "Arman Thakur",
      role: "Full Stack Developer",
      bio: "Specializes in React development and creating intuitive user interfaces.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      github: "https://github.com/kaihere14",
      linkedin: "https://www.linkedin.com/in/arman-thakur-303b47367/",
    },
    {
      id: 3,
      name: "Kamna Jolhe",
      role: "UI/UX Designer",
      bio: "Expert in Node.js, MongoDB, and building robust API architectures.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      github: "https://github.com/michaelrodriguez",
      linkedin: "https://www.linkedin.com/in/kamnajolhe/",
    },
    {
      id: 4,
      name: "Samprad Das",
      role: "Front-End Developer",
      bio: "Ensures product quality and manages development workflows and testing.",
      image:
        "https://res.cloudinary.com/dsplnfii2/image/upload/v1756542200/Samprad_cirzmq.jpg",
      github: "https://github.com/Sam-2503",
      linkedin: "https://linkedin.com/in/samprad",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 sm:text-5xl lg:text-6xl">
            Meet Our Team
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            We're a passionate group of developers and designers working
            together to revolutionize personal finance management. Get to know
            the people behind FinBuddy.
          </p>
        </div>

        {/* Team Name Section */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl font-bold">Team: Polaris</h2>
          </div>
          <p className="text-zinc-400 text-lg">
            Building the future of personal finance, one feature at a time.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 hover:border-zinc-700 transition-colors"
            >
              {/* Member Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-zinc-700">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-zinc-400 text-sm font-medium">
                  {member.role}
                </p>
              </div>

              {/* Member Bio */}
              <p className="text-zinc-300 text-sm text-center mb-6 leading-relaxed">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-4">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm"
                >
                  <GitHubIcon className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Project Repository Section */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Project Repository</h2>
          <p className="text-zinc-400 mb-6">
            Budgenix is an open-source project. Check out our code, contribute,
            or report issues on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://github.com/kaihere14/Budgenix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// Icon Components
function GitHubIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ForkIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 18.178l4.62-1.256.623-6.778H12V7.617h8.46l-.45 8.925-8.01 2.097-8.01-2.097-.45-8.925H12v2.527H6.757l.623 6.778L12 18.178z" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}
