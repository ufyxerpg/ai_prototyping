import yaml from "js-yaml";

import navMd from "@/content/nav.md?raw";
import heroMd from "@/content/hero.md?raw";
import howItWorksMd from "@/content/howItWorks.md?raw";
import pricingMd from "@/content/pricing.md?raw";
import ctaMd from "@/content/cta.md?raw";
import footerMd from "@/content/footer.md?raw";
import authMd from "@/content/auth.md?raw";
import onboardingMd from "@/content/onboarding.md?raw";
import generateMd from "@/content/generate.md?raw";
import subscribeMd from "@/content/subscribe.md?raw";

function parseFrontmatter<T>(source: string): T {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("Missing frontmatter");
  return yaml.load(match[1]) as T;
}

export interface NavContent {
  brand: string;
  links: { href: string; label: string }[];
  signIn: string;
  register: string;
  signOut: string;
}

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  promptPlaceholder: string;
  promptButton: string;
  howItWorksLink: string;
  chapterLabel: string;
  chapterText: string;
  imageAlt: string;
}

export interface HowItWorksContent {
  eyebrow: string;
  title: string;
  description: string;
  steps: { icon: string; title: string; body: string }[];
}

export interface PricingContent {
  eyebrow: string;
  title: string;
  description: string;
  highlightedBadge: string;
  tiers: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlighted: boolean;
  }[];
}

export interface CtaContent {
  title: string;
  description: string;
  registerButton: string;
  signInButton: string;
}

export interface FooterContent {
  copyright: string;
  links: { label: string; href: string }[];
}

export interface AuthContent {
  brand: string;
  signIn: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    switchPrompt: string;
    switchLink: string;
    errorGeneric: string;
  };
  register: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    submit: string;
    switchPrompt: string;
    switchLink: string;
    successTitle: string;
    successMessage: string;
    errorGeneric: string;
  };
}

export const navContent = parseFrontmatter<NavContent>(navMd);
export const heroContent = parseFrontmatter<HeroContent>(heroMd);
export const howItWorksContent = parseFrontmatter<HowItWorksContent>(howItWorksMd);
export const pricingContent = parseFrontmatter<PricingContent>(pricingMd);
export const ctaContent = parseFrontmatter<CtaContent>(ctaMd);
export const footerContent = parseFrontmatter<FooterContent>(footerMd);
export interface OnboardingContent {
  title: string;
  subtitle: string;
  stepLabel: string;
  ofLabel: string;
  back: string;
  next: string;
  finish: string;
  saving: string;
  errorGeneric: string;
  steps: {
    age: { question: string; options: string[] };
    country: { question: string; placeholder: string; options: string[] };
    name: { question: string; placeholder: string };
    gender: { question: string; options: string[] };
  };
}

export interface GenerateContent {
  title: string;
  subtitle: string;
  ideaLabel: string;
  ideaPlaceholder: string;
  generateButton: string;
  generatingButton: string;
  subscribeButton: string;
  limitNote: string;
  storyHeading: string;
  newStoryButton: string;
  errorGeneric: string;
  backHome: string;
}

export interface SubscribeContent {
  title: string;
  subtitle: string;
  plansLabel: string;
  plans: { id: string; name: string; price: string; period: string; description: string }[];
  cardLabel: string;
  cardPlaceholder: string;
  expiryLabel: string;
  expiryPlaceholder: string;
  cvcLabel: string;
  cvcPlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  payButton: string;
  processingButton: string;
  notCompletedTitle: string;
  notCompletedMessage: string;
  backButton: string;
}

export const authContent = parseFrontmatter<AuthContent>(authMd);
export const onboardingContent = parseFrontmatter<OnboardingContent>(onboardingMd);
export const generateContent = parseFrontmatter<GenerateContent>(generateMd);
export const subscribeContent = parseFrontmatter<SubscribeContent>(subscribeMd);
