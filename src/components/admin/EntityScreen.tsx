"use client";

import { EntityManager, type EntityConfig } from "@/components/admin/EntityManager";
import {
  courseConfig,
  categoryConfig,
  userConfig,
  mentorConfig,
  enrollmentConfig,
  internshipConfig,
  applicationConfig,
  projectConfig,
  tutoringConfig,
  classConfig,
  leadConfig,
  paymentConfig,
  astrologyReportConfig,
  astrologyMatchConfig,
  offeringConfig,
  teamConfig,
  milestoneConfig,
  galleryConfig,
  faqConfig,
  partnerConfig,
  clientConfig,
  testimonialConfig,
  eventConfig,
  notificationConfig,
} from "@/components/admin/entityConfigs";

const configs: Record<string, EntityConfig> = {
  courses: courseConfig,
  offerings: offeringConfig,
  team: teamConfig,
  milestones: milestoneConfig,
  gallery: galleryConfig,
  faq: faqConfig,
  partners: partnerConfig,
  clients: clientConfig,
  testimonials: testimonialConfig,
  events: eventConfig,
  categories: categoryConfig,
  users: userConfig,
  mentors: mentorConfig,
  enrollments: enrollmentConfig,
  internships: internshipConfig,
  applications: applicationConfig,
  projects: projectConfig,
  tutoring: tutoringConfig,
  classes: classConfig,
  leads: leadConfig,
  payments: paymentConfig,
  astrologyReports: astrologyReportConfig,
  astrologyMatches: astrologyMatchConfig,
  notifications: notificationConfig,
};

/** Server pages pass just the entity key; all config stays client-side. */
export function EntityScreen({ entity }: { entity: keyof typeof configs }) {
  return <EntityManager config={configs[entity]} />;
}
