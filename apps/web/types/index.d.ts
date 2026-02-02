export interface Image {
    src: string;
    alt: string;
    caption?: string;
}

export interface ListItem {
    title: string;
    description?: string;
    iconUrl?: string;
    lucideIcon?: string;
    link?: string;
    image: Image;
}