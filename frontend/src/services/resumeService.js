/**
 * Resume Service - Manages Resume Builder data
 * Completely independent from student profile data
 * Data stored in localStorage for offline capability
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const RESUME_STORAGE_KEY = 'europass_resume_data';

// Default resume template
const defaultResumeTemplate = {
  id: null,
  createdAt: null,
  updatedAt: null,
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    website: '',
    linkedIn: ''
  },
  headline: '',
  summary: '',
  education: [],
  workExperience: [],
  skills: {
    technical: [],
    languages: [],
    soft: []
  },
  certifications: [],
  projects: [],
  languages: []
};

/**
 * Get all saved resumes
 */
export const getAllResumes = () => {
  try {
    const resumes = localStorage.getItem(RESUME_STORAGE_KEY);
    return resumes ? JSON.parse(resumes) : [];
  } catch (error) {
    console.error('Error retrieving resumes:', error);
    return [];
  }
};

/**
 * Get a specific resume by ID
 */
export const getResumeById = (resumeId) => {
  try {
    const resumes = getAllResumes();
    return resumes.find(r => r.id === resumeId) || null;
  } catch (error) {
    console.error('Error retrieving resume:', error);
    return null;
  }
};

/**
 * Create a new resume
 */
export const createNewResume = (resumeName = 'Untitled Resume') => {
  try {
    const resumes = getAllResumes();
    const newResume = {
      ...defaultResumeTemplate,
      id: Date.now().toString(),
      name: resumeName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    resumes.push(newResume);
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumes));
    return newResume;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

/**
 * Save resume data
 */
export const saveResume = (resumeId, resumeData) => {
  try {
    const resumes = getAllResumes();
    const index = resumes.findIndex(r => r.id === resumeId);

    if (index >= 0) {
      resumes[index] = {
        ...resumes[index],
        ...resumeData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumes));
      return resumes[index];
    } else {
      throw new Error('Resume not found');
    }
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};

/**
 * Delete a resume
 */
export const deleteResume = (resumeId) => {
  try {
    const resumes = getAllResumes();
    const filtered = resumes.filter(r => r.id !== resumeId);
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

/**
 * Export resume as PDF
 */
export const exportResumePDF = async (resumeId, resumeName = 'Resume') => {
  try {
    // For now, we use client-side export because it's already configured for Europass styling
    // and the backend is currently a placeholder returning JSON instead of a PDF blob.
    return exportResumePDFClient(resumeId, resumeName);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

/**
 * Client-side PDF export fallback
 */
export const exportResumePDFClient = (resumeId, resumeName = 'Resume') => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    // Use html2pdf to export
    const element = document.getElementById('resume-preview-content');
    if (!element) throw new Error('Resume preview not found');

    const options = {
      margin: 10,
      filename: `${resumeName}_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    // Dynamic import of html2pdf
    import('html2pdf.js').then(html2pdf => {
      html2pdf.default().set(options).from(element).save();
    });

    return true;
  } catch (error) {
    console.error('Error in client PDF export:', error);
    throw error;
  }
};

/**
 * Add education entry
 */
export const addEducation = (resumeId, education) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    resume.education.push({
      id: Date.now().toString(),
      institution: education.institution || '',
      degree: education.degree || '',
      field: education.field || '',
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      description: education.description || '',
      grade: education.grade || ''
    });

    return saveResume(resumeId, resume);
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

/**
 * Update education entry
 */
export const updateEducation = (resumeId, educationId, education) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    const index = resume.education.findIndex(e => e.id === educationId);
    if (index >= 0) {
      resume.education[index] = { ...resume.education[index], ...education };
      return saveResume(resumeId, resume);
    }
    throw new Error('Education entry not found');
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

/**
 * Delete education entry
 */
export const deleteEducation = (resumeId, educationId) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    resume.education = resume.education.filter(e => e.id !== educationId);
    return saveResume(resumeId, resume);
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

/**
 * Add work experience entry
 */
export const addWorkExperience = (resumeId, experience) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    resume.workExperience.push({
      id: Date.now().toString(),
      company: experience.company || '',
      position: experience.position || '',
      startDate: experience.startDate || '',
      endDate: experience.endDate || '',
      currentlyWorking: experience.currentlyWorking || false,
      description: experience.description || '',
      achievements: experience.achievements || []
    });

    return saveResume(resumeId, resume);
  } catch (error) {
    console.error('Error adding work experience:', error);
    throw error;
  }
};

/**
 * Update work experience entry
 */
export const updateWorkExperience = (resumeId, experienceId, experience) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    const index = resume.workExperience.findIndex(e => e.id === experienceId);
    if (index >= 0) {
      resume.workExperience[index] = { ...resume.workExperience[index], ...experience };
      return saveResume(resumeId, resume);
    }
    throw new Error('Work experience entry not found');
  } catch (error) {
    console.error('Error updating work experience:', error);
    throw error;
  }
};

/**
 * Delete work experience entry
 */
export const deleteWorkExperience = (resumeId, experienceId) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    resume.workExperience = resume.workExperience.filter(e => e.id !== experienceId);
    return saveResume(resumeId, resume);
  } catch (error) {
    console.error('Error deleting work experience:', error);
    throw error;
  }
};

/**
 * Add skill
 */
export const addSkill = (resumeId, skillType, skill) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    const validTypes = ['technical', 'languages', 'soft'];
    if (!validTypes.includes(skillType)) throw new Error('Invalid skill type');

    if (!resume.skills[skillType].includes(skill)) {
      resume.skills[skillType].push(skill);
      return saveResume(resumeId, resume);
    }
    return resume;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

/**
 * Remove skill
 */
export const removeSkill = (resumeId, skillType, skill) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    resume.skills[skillType] = resume.skills[skillType].filter(s => s !== skill);
    return saveResume(resumeId, resume);
  } catch (error) {
    console.error('Error removing skill:', error);
    throw error;
  }
};

/**
 * Add language with CEFR level
 */
export const addLanguage = (resumeId, language) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    resume.languages.push({
      id: Date.now().toString(),
      name: language.name || '',
      proficiency: language.proficiency || 'A1', // CEFR level
      certificate: language.certificate || '',
      certificationDate: language.certificationDate || ''
    });

    return saveResume(resumeId, resume);
  } catch (error) {
    console.error('Error adding language:', error);
    throw error;
  }
};

/**
 * Get AI suggestions for resume improvement
 */
export const getAISuggestions = async (resumeId, section = null) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    const response = await axios.post(`${API_BASE_URL}/resume/ai-suggestions`, {
      resume: resume,
      section: section
    });

    return response.data;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return null;
  }
};

/**
 * Get skill gap analysis
 */
export const getSkillGapAnalysis = async (resumeId, universityId = null) => {
  try {
    const resume = getResumeById(resumeId);
    if (!resume) throw new Error('Resume not found');

    const response = await axios.post(`${API_BASE_URL}/resume/skill-gap-analysis`, {
      resume: resume,
      universityId: universityId
    });

    return response.data;
  } catch (error) {
    console.error('Error getting skill gap analysis:', error);
    return null;
  }
};

/**
 * Generate AI professional summary
 */
export const generateAISummary = async (resume) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resume/ai/generate-summary`, {
      name: resume.personalInfo?.fullName || 'Professional',
      headline: resume.personalInfo?.headline || '',
      education: resume.education || [],
      experience: resume.workExperience || [],
      skills: [
        ...(resume.skills?.technical || []),
        ...(resume.skills?.soft || [])
      ]
    });

    return response.data;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    throw error;
  }
};

export default {
  getAllResumes,
  getResumeById,
  createNewResume,
  saveResume,
  deleteResume,
  exportResumePDF,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSkill,
  removeSkill,
  addLanguage,
  getAISuggestions,
  getSkillGapAnalysis,
  generateAISummary
};
