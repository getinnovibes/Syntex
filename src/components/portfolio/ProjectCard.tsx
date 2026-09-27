import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative bg-surface-container-lowest rounded-3xl p-4 shadow-[0_16px_36px_-10px_rgba(8,8,8,0.05)] border border-outline-variant/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Cover Preview */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-surface-container mb-4">
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-surface-container-lowest/85 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-outline-variant/20">
            <span className="font-label-sm text-[11px] text-primary font-semibold">
              {project.category}
            </span>
          </div>
          {project.featured && (
            <div className="absolute top-3 right-3 bg-primary-container text-white px-2.5 py-0.5 rounded-full shadow-sm">
              <span className="font-label-sm text-[10px] font-semibold uppercase tracking-wider">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Title & Arrow */}
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-xl font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
            {project.title}
          </h3>
          <span className="w-8 h-8 rounded-full bg-secondary-container/60 text-primary flex items-center justify-center shrink-0 ml-2 group-hover:bg-primary group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-[16px]">north_east</span>
          </span>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
          {project.short_description}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-label-sm text-secondary">
        <span className="truncate max-w-[180px]">{project.client || 'Studio Work'}</span>
        <span>{project.year || '2024'}</span>
      </div>
    </Link>
  );
};
