import * as React from 'react';
import { cn } from '../utils/cn';
import { Typography} from '../primitives/Typography';

export interface HeroBlockProps {
    backgroundProps?: {
      backgroundColor?: string;
      backgroundImageUrl?: string;
      className?: string;
      styles?: React.CSSProperties;
    }

    tagProps?: {
      content: React.ReactNode;
      images: Array<{
        src: string;
        alt: string;
        caption?: string;
      }>;
      className?: string;
      styles?: React.CSSProperties;
    }

    titleProps?: {
      content: React.ReactNode;
      className?: string;
      styles?: React.CSSProperties;
    }
    subTitleProps?: {
      content: React.ReactNode;
      className?: string;
      styles?: React.CSSProperties;
    }
    ctaProps?: {
      className?: string;
      styles?: React.CSSProperties;
    }
    
    // Legacy props for backward compatibility
    title?: string;
    subtitle?: string;
    backgroundImageUrl?: string;
}

const dummyImages = [{
    src: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50',
    alt: 'userImage1'
  },
  {
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50',
    alt: 'userImage2'
  },
  {
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop',
    alt: 'userImage3' 
  }];

export const HeroBlock = ({
  backgroundProps,
  tagProps,
  titleProps,
  subTitleProps,
  // Legacy props
  title,
  subtitle,
  backgroundImageUrl,
}: HeroBlockProps) => {
    // Support both new props pattern and legacy props
    const resolvedBackgroundProps = backgroundProps ?? {
      backgroundColor: 'transparent',
      backgroundImageUrl: backgroundImageUrl || 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-image-grain.png',
      className: '',
      styles: {}
    };
    
    const resolvedTagProps = tagProps ?? {
      images: dummyImages,
      content: 'Join community of 1m+ founders',
      className: '',
      styles: {}
    };
    
    const resolvedTitleProps = titleProps ?? {
      content: title || 'Grow Your Business',
      className: '',
      styles: {}
    };
    
    const resolvedSubTitleProps = subTitleProps ?? {
      content: subtitle || `
Flexible tools, thoughtful design and the freedom to build your way. No limitations, no compromises.

Secure your spot early and unlock our limited-time founding rate.
      `,
      className: '',
      styles: {}
    };
    
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            
                .font-berkshire {
                    font-family: 'Berkshire Swash', cursive;
                }
            `}</style>
            <section
              className={`flex flex-col items-center pb-48 text-center text-sm text-white max-md:px-2 bg-cover bg-center`}
              aria-label="Hero"
              role="banner"
              style={{
                backgroundColor: resolvedBackgroundProps.backgroundColor,
                backgroundImage: `url(${resolvedBackgroundProps.backgroundImageUrl})`,
                ...resolvedBackgroundProps.styles
              }}
            >
                <div className="flex flex-wrap items-center justify-center p-1.5 mt-24 md:mt-28 rounded-full border border-slate-400 text-xs">
                    <div className="flex items-center">
                        {resolvedTagProps.images.map((image, index) => (
                            <div key={index} className={index === 0 ? '' : '-translate-x-2'}>
                                <img
                                    className="size-7 rounded-full border-3 border-white"
                                    src={image.src}
                                    alt={image.alt}
                                />
                            </div>
                        ))}
                    </div>
                    <Typography variant="paragraph" className={cn('-translate-x-2', resolvedTagProps?.className)} style={resolvedTagProps?.styles} as={"p"}>
                        {resolvedTagProps?.content}
                    </Typography>
                </div>
                <Typography variant="h1" className={cn("font-berkshire text-[45px]/[52px] md:text-6xl/[65px]", resolvedTitleProps?.className)} style={resolvedTitleProps?.styles} as={"h1"}>
                    {resolvedTitleProps?.content}
                </Typography>
                <Typography variant="paragraph" className={cn("text-base mt-2 max-w-xl md:mt-7", resolvedSubTitleProps?.className)} style={resolvedSubTitleProps?.styles} as={"p"}>
                    {resolvedSubTitleProps?.content}
                </Typography>
            </section>
        </>
    );
};

export const HeroBlockSpec = {
  id: 'hero-block-with-background',
  label: 'Hero Block (with Background)',
  description: 'Hero section with title, subtitle, tags and background image',
  thumbnail: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-image-grain.png',
  category: 'hero',
  title: {
    id: 'hero-block-with-background-title',
    editor: 'typography',
    label: 'Title',
    propName: 'titleProps',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Grow Your Business',
      variant: 'h1',
      fontSize: '60px',
      fontWeight: 'normal',
      fontFamily: 'inherit',
      lineHeight: '65px',
      letterSpacing: 'normal',
      textAlign: 'center',
      color: '#ffffff'
    }
  },
  subTitle: {
    id: 'hero-block-with-background-subtitle',
    editor: 'typography',
    label: 'Sub Title',
    propName: 'subTitleProps',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Flexible tools, thoughtful design and the freedom to build your way. No limitations, no compromises. Secure your spot early and unlock our limited-time founding rate.',
      variant: 'paragraph',
      fontSize: '16px',
      fontWeight: 'normal',
      fontFamily: 'inherit',
      lineHeight: '24px',
      letterSpacing: 'normal',
      textAlign: 'center',
      color: '#ffffff'
    }
  },
  tags: {
    id: 'hero-block-with-background-tags',
    editor: 'typography',
    label: 'Tags',
    propName: 'tagProps',
    controls: [
      'content', 'variant', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'color'
    ],
    default: {
      content: 'Join community of 1m+ founders',
      variant: 'paragraph',
      fontSize: '12px',
      fontWeight: 'normal',
      fontFamily: 'inherit',
      lineHeight: '16px',
      letterSpacing: 'normal',
      textAlign: 'center',
      color: '#ffffff'
    }
  },
  background: {
    id: 'hero-block-with-background-background',
    editor: 'background',
    label: 'Background',
    propName: 'backgroundProps',
    controls: [
      'backgroundColor', 'backgroundImage'
    ],
    default: {
      backgroundColor: 'transparent',
      backgroundImage: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-image-grain.png'
    }
  }
}