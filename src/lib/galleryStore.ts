export interface GalleryImage {
    id: string;
    title: string;
    description: string | null;
    image_url: string;
    created_at: number;
}

const STORAGE_KEY = "techshastra_gallery_images";

export const sampleGalleryImages: GalleryImage[] = [
    {
        id: "gallery-sample-1",
        title: "Project Exhibition",
        description: "Showcasing technical excellence and innovation.",
        image_url: "/gallery/DSC_0004.JPG",
        created_at: 1735689600000,
    },
    {
        id: "gallery-sample-2",
        title: "Workshop Session",
        description: "Hands-on learning and collaborative problem solving.",
        image_url: "/gallery/DSC_0006.JPG",
        created_at: 1736985600000,
    },
    {
        id: "gallery-sample-3",
        title: "Team Collaboration",
        description: "Focus and dedication in the tech lab.",
        image_url: "/gallery/DSC_0013.JPG",
        created_at: 1738281600000,
    },
    {
        id: "gallery-sample-4",
        title: "TECHSHASTRA Event",
        description: "Captured moments from our flagship technical events.",
        image_url: "/gallery/DSCN0992.JPG",
        created_at: 1739577600000,
    },
    {
        id: "gallery-sample-5",
        title: "Hackathon Highlights",
        description: "Midnight coding sessions and creative energy.",
        image_url: "/gallery/DSCN1004.JPG",
        created_at: 1739836800000,
    },
    {
        id: "gallery-sample-6",
        title: "Innovation Lab",
        description: "Where ideas transform into reality.",
        image_url: "/gallery/DSC_0024.JPG",
        created_at: 1739923200000,
    },
    {
        id: "gallery-sample-7",
        title: "Technical Discussion",
        description: "Brainstorming the next big project.",
        image_url: "/gallery/DSCN1064.JPG",
        created_at: 1739924200000,
    },
    {
        id: "gallery-sample-8",
        title: "Project Development",
        description: "Iterating on hardware and software prototypes.",
        image_url: "/gallery/DSC_0034.JPG",
        created_at: 1739925200000,
    },
    {
        id: "gallery-sample-9",
        title: "Community Growth",
        description: "Expanding our reach and impact.",
        image_url: "/gallery/DSCN1107.JPG",
        created_at: 1739926200000,
    },
    {
        id: "gallery-sample-10",
        title: "Flagship Seminar",
        description: "Learning from the best in the industry.",
        image_url: "/gallery/DSC_0046.JPG",
        created_at: 1739927200000,
    }
];

const generateId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getStoredGalleryImages = (): GalleryImage[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const getAllGalleryImages = (): GalleryImage[] => {
    const stored = getStoredGalleryImages();
    return [...stored, ...sampleGalleryImages].sort((a, b) => b.created_at - a.created_at);
};

export const addGalleryImage = (image: Omit<GalleryImage, "id" | "created_at">): GalleryImage => {
    const images = getStoredGalleryImages();
    const newImage: GalleryImage = {
        ...image,
        id: generateId(),
        created_at: Date.now(),
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newImage, ...images]));
    } catch (e) {
        console.error("Gallery storage failed", e);
        throw e;
    }

    return newImage;
};

export const deleteGalleryImage = (id: string) => {
    const images = getStoredGalleryImages();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images.filter(img => img.id !== id)));
};
