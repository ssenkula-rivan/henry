'use client';

import { useState } from 'react';

interface RoleInfo {
  title: string;
  description: string;
  skills: string[];
  projects: string[];
}

const roleData: Record<string, RoleInfo> = {
  'Graphic Designer': {
    title: 'Graphic Designer',
    description: 'Creating compelling visual communications that combine aesthetics with strategic messaging to effectively communicate brand stories and marketing objectives.',
    skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Typography', 'Color Theory', 'Print Design'],
    projects: ['Brand Identity Systems', 'Marketing Materials', 'Editorial Design', 'Package Design', 'Digital Graphics']
  },
  'Visual Artist': {
    title: 'Visual Artist',
    description: 'Expressing creative vision through various artistic mediums, developing unique visual styles that evoke emotion and convey meaningful narratives.',
    skills: ['Digital Illustration', 'Mixed Media', 'Concept Art', 'Visual Storytelling', 'Creative Direction', 'Artistic Composition'],
    projects: ['Digital Illustrations', 'Concept Art', 'Mixed Media Works', 'Art Direction', 'Creative Campaigns']
  },
  'Brand Identity': {
    title: 'Brand Identity Specialist',
    description: 'Developing comprehensive brand systems that create cohesive visual identities, ensuring consistency across all touchpoints and building strong brand recognition.',
    skills: ['Brand Strategy', 'Logo Design', 'Visual Identity Systems', 'Brand Guidelines', 'Market Research', 'Brand Positioning'],
    projects: ['Complete Brand Identities', 'Logo Design', 'Brand Guidelines', 'Rebranding Projects', 'Brand Strategy']
  }
};

export default function RoleButtons() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleClick = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  const roles = ['Graphic Designer', 'Visual Artist', 'Brand Identity'];

  return (
    <div className="space-y-4">
      {/* Role Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleClick(role)}
            className={`px-4 py-2 font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300 ${
              selectedRole === role
                ? 'bg-[#e8c84a] text-black'
                : 'border border-[rgba(232,200,74,0.3)] text-white hover:border-[#e8c84a] hover:text-[#e8c84a]'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Role Information Panel */}
      {selectedRole && (
        <div className="bg-[#141414] border border-[rgba(232,200,74,0.18)] p-6 rounded-lg animate-fadeIn">
          <div className="space-y-4">
            {/* Title */}
            <h3 className="font-serif text-xl font-bold text-[#e8c84a]">
              {roleData[selectedRole].title}
            </h3>

            {/* Description */}
            <p className="text-[rgba(245,240,235,0.8)] leading-relaxed">
              {roleData[selectedRole].description}
            </p>

            {/* Skills */}
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] mb-2">Core Skills</h4>
              <div className="flex flex-wrap gap-2">
                {roleData[selectedRole].skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-[rgba(232,200,74,0.1)] border border-[rgba(232,200,74,0.2)] text-[#e8c84a] text-xs font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-[#888] mb-2">Project Types</h4>
              <div className="flex flex-wrap gap-2">
                {roleData[selectedRole].projects.map((project) => (
                  <span
                    key={project}
                    className="px-3 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white text-xs font-mono"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedRole(null)}
              className="text-[#888] hover:text-white text-xs font-mono tracking-widest uppercase transition-colors duration-200"
            >
              Close ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
