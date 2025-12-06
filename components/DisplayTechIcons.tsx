'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const techIconBaseURL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const mappings: Record<string, string> = {
  'react': 'react',
  'nextjs': 'nextjs',
  'nodejs': 'nodejs',
  'typescript': 'typescript',
  'javascript': 'javascript',
  'python': 'python',
  'java': 'java',
  'csharp': 'csharp',
  'cpp': 'cplusplus',
  'c': 'c',
  'go': 'go',
  'rust': 'rust',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'php': 'php',
  'ruby': 'ruby',
  'html': 'html5',
  'css': 'css3',
  'mongodb': 'mongodb',
  'mysql': 'mysql',
  'postgresql': 'postgresql',
  'redis': 'redis',
  'docker': 'docker',
  'kubernetes': 'kubernetes',
  'aws': 'amazonwebservices',
  'azure': 'azure',
  'git': 'git',
  'graphql': 'graphql',
  'vue': 'vuejs',
  'angular': 'angularjs',
  'express': 'express',
  'django': 'django',
  'flask': 'flask',
  'spring': 'spring',
  'dotnet': 'dot-net',
  'tailwind': 'tailwindcss',
  'bootstrap': 'bootstrap',
  'sass': 'sass',
  'webpack': 'webpack',
  'vite': 'vitejs',
  'firebase': 'firebase',
};

const normalizeTechName = (tech: string): string => {
  const key = tech.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, '');
  return mappings[key] || tech.toLowerCase();
};

const getTechLogoUrl = (tech: string): string => {
  const normalized = normalizeTechName(tech);
  return `${techIconBaseURL}/${normalized}/${normalized}-original.svg`;
};

export const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  return (
    <div className="flex flex-row">
      {techStack.slice(0, 3).map((tech, index) => {
        const url = getTechLogoUrl(tech);
        return (
          <div key={tech} className={cn("relative group bg-dark-300 rounded-full p-2 flex-center", index >= 1 && '-ml-3')}>
            <span className='tech-tooltip'>{tech}</span>
            <Image 
              src={url} 
              alt={tech} 
              width={100} 
              height={100} 
              className="size-5"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/tech.svg';
              }}
            /> 
          </div>
        );
      })}
    </div>
  );
};