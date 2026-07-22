export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  location: string;
  email: string;
  linkedInUrl: string;
  photoUrl: string;
}

export interface Certification {
  id?: number;
  name: string;
  description: string;
}

export interface Skill {
  id?: number;
  category: string;
  value: string;
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  descriptions: string;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  highlights: string;
  technologies: string;
}

export interface Formation {
  id?: number;
  degree: string;
  school: string;
  startDate: string;
  endDate: string | null;
}

export interface Language {
  id?: number;
  name: string;
  level: string;
}

export interface Cv {
  id: number;
  personalInfo: PersonalInfo;
  profileSummary: string;
  certifications: Certification[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  formations: Formation[];
  languages: Language[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
