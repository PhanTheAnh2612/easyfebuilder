import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create SUPER_ADMIN user
  const superAdminEmail = 'phantheanh2612@gmail.com';
  const superAdminPassword = 'Anhpt2612!@';
  
  const hashedPassword = await bcrypt.hash(superAdminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      name: 'Super Admin',
      isActive: true,
      needsPasswordSetup: false,
    },
    create: {
      email: superAdminEmail,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      name: 'Super Admin',
      isActive: true,
      needsPasswordSetup: false,
    },
  });

  console.log(`✅ SUPER_ADMIN created: ${superAdmin.email}`);

  // Create default system templates (public)
  const defaultTemplates = [
    {
      id: 'modern-saas',
      name: 'Modern SaaS',
      category: 'saas',
      description: 'Clean and modern template for SaaS products',
      thumbnail: 'https://placehold.co/400x300/e0f2fe/0284c7?text=SaaS',
      isPublic: true,
      sections: [
        {
          id: 'hero',
          type: 'hero',
          name: 'Hero Section',
          editableFields: [
            { id: 'headline', label: 'Headline', type: 'text', defaultValue: 'Build Something Amazing' },
            { id: 'subheadline', label: 'Subheadline', type: 'text', defaultValue: 'The fastest way to launch your product' },
            { id: 'cta-text', label: 'CTA Button Text', type: 'text', defaultValue: 'Get Started' },
            { id: 'cta-link', label: 'CTA Button Link', type: 'link', defaultValue: '/signup' },
            { id: 'bg-image', label: 'Background Image', type: 'image', defaultValue: 'https://placehold.co/1920x1080' },
          ],
        },
        {
          id: 'features',
          type: 'features',
          name: 'Features Section',
          editableFields: [
            { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Powerful Features' },
            { id: 'feature-1-title', label: 'Feature 1 Title', type: 'text', defaultValue: 'Easy to Use' },
            { id: 'feature-1-desc', label: 'Feature 1 Description', type: 'text', defaultValue: 'Intuitive interface' },
            { id: 'feature-2-title', label: 'Feature 2 Title', type: 'text', defaultValue: 'Customizable' },
            { id: 'feature-2-desc', label: 'Feature 2 Description', type: 'text', defaultValue: 'Make it match your brand' },
          ],
        },
        {
          id: 'pricing',
          type: 'pricing',
          name: 'Pricing Section',
          editableFields: [
            { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Simple Pricing' },
            { id: 'plan-1-name', label: 'Plan 1 Name', type: 'text', defaultValue: 'Starter' },
            { id: 'plan-1-price', label: 'Plan 1 Price', type: 'text', defaultValue: '$9/mo' },
            { id: 'plan-2-name', label: 'Plan 2 Name', type: 'text', defaultValue: 'Pro' },
            { id: 'plan-2-price', label: 'Plan 2 Price', type: 'text', defaultValue: '$29/mo' },
          ],
        },
      ],
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      category: 'portfolio',
      description: 'Showcase your work with style',
      thumbnail: 'https://placehold.co/400x300/fce7f3/be185d?text=Portfolio',
      isPublic: true,
      sections: [
        {
          id: 'hero',
          type: 'hero',
          name: 'Hero Section',
          editableFields: [
            { id: 'headline', label: 'Your Name', type: 'text', defaultValue: 'John Doe' },
            { id: 'subheadline', label: 'Title', type: 'text', defaultValue: 'Creative Designer' },
            { id: 'cta-text', label: 'CTA Text', type: 'text', defaultValue: 'View My Work' },
            { id: 'cta-link', label: 'CTA Link', type: 'link', defaultValue: '#projects' },
          ],
        },
      ],
    },
    {
      id: 'business-landing',
      name: 'Business Landing',
      category: 'business',
      description: 'Professional landing page for businesses',
      thumbnail: 'https://placehold.co/400x300/d1fae5/047857?text=Business',
      isPublic: true,
      sections: [
        {
          id: 'hero',
          type: 'hero',
          name: 'Hero Section',
          editableFields: [
            { id: 'headline', label: 'Headline', type: 'text', defaultValue: 'Grow Your Business' },
            { id: 'subheadline', label: 'Subheadline', type: 'text', defaultValue: 'We help companies scale' },
            { id: 'cta-text', label: 'CTA Text', type: 'text', defaultValue: 'Contact Us' },
            { id: 'cta-link', label: 'CTA Link', type: 'link', defaultValue: '/contact' },
          ],
        },
        {
          id: 'features',
          type: 'features',
          name: 'Services Section',
          editableFields: [
            { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Our Services' },
            { id: 'feature-1-title', label: 'Service 1', type: 'text', defaultValue: 'Consulting' },
            { id: 'feature-1-desc', label: 'Service 1 Desc', type: 'text', defaultValue: 'Expert advice for your business' },
            { id: 'feature-2-title', label: 'Service 2', type: 'text', defaultValue: 'Development' },
            { id: 'feature-2-desc', label: 'Service 2 Desc', type: 'text', defaultValue: 'Custom solutions built for you' },
          ],
        },
      ],
    },
  ];

  for (const template of defaultTemplates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        description: template.description,
        thumbnail: template.thumbnail,
        category: template.category,
        isPublic: template.isPublic,
        sections: template.sections,
      },
      create: {
        id: template.id,
        name: template.name,
        description: template.description,
        thumbnail: template.thumbnail,
        category: template.category,
        isPublic: template.isPublic,
        sections: template.sections,
      },
    });
    console.log(`✅ Template created: ${template.name}`);
  }

  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
