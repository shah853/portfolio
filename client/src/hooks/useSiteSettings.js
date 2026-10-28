import { useMemo } from 'react';
import useFetch from './useFetch';
import siteConfig from '../config/siteConfig';

const defaultSettings = {
  fullName: siteConfig.name,
  name: siteConfig.name,
  role: siteConfig.role,
  shortIntro: siteConfig.shortIntro || siteConfig.tagline,
  tagline: siteConfig.shortIntro || siteConfig.tagline,
  aboutDescription: siteConfig.about.join('\n\n'),
  about: siteConfig.about,
  profileImage: siteConfig.profileImage,
  email: siteConfig.email,
  phone: '',
  location: siteConfig.location,
  github: siteConfig.github,
  linkedin: siteConfig.linkedin,
  resumeUrl: siteConfig.resumeUrl,
  highlights: siteConfig.highlights,
};

export default function useSiteSettings() {
  const { data, loading } = useFetch('/settings');
  const settings = useMemo(() => {
    const merged = Object.fromEntries(
      Object.entries(defaultSettings).map(([field, fallback]) => {
        const value = data?.[field];
        return [
          field,
          typeof value === 'string' && value.trim() ? value : fallback,
        ];
      })
    );

    merged.name = merged.fullName;
    merged.tagline = merged.shortIntro;
    merged.about = merged.aboutDescription
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    merged.highlights = siteConfig.highlights.map((highlight) => {
      if (highlight.label === 'Location') {
        return { ...highlight, value: merged.location };
      }
      if (highlight.label === 'Role') {
        return { ...highlight, value: merged.role };
      }
      return highlight;
    });

    return merged;
  }, [data]);

  return { settings, loading };
}
