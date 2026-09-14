export interface Agency {
  name: string;
  url?: string;
}

export interface ProjectTeam {
  text: string;
  agency: Agency;
}

export interface ProjectRoles {
  text: string;
  items: string[];
}

export interface Project {
  title?: string;
  cursorIndication?: string;
  sectionType: 'slider' | 'webgl';
  projectIndex?: number;
  projectKey?: string;
  name?: string;
  type?: string;
  date?: string;
  recognitions?: string[];
  team?: ProjectTeam;
  projectLink?: { text: string; url: string };
  roles?: ProjectRoles;
  textLines?: string[];
  cameraParams?: {
    scrollRangePosition: { x: number; y: number; z: number };
    scrollRangeRotation: { x: number; y: number; z: number };
    scrollOffsetPosition: { x: number; y: number; z: number };
    scrollOffsetRotation: { x: number; y: number; z: number };
  };
}

export interface ArchiveItem {
  name: string;
  type: string;
  roles: string;
  date: string;
  agency: Agency;
  infos: string[];
  projectLink?: { text: string; url: string };
  media: {
    url2: string;
    isVideo: boolean;
  };
}

export interface PlaygroundItem {
  id: number;
  type: 'video' | 'image';
  src: string;
  title: string;
  description?: string;
  aspect?: string;
}

export const SITE_DATA = {
  global: {
    title: "Léo Parpeix",
    infos: "Art director, Interactive designer",
    navbar: {
      links: [
        { name: "Work", path: "/" },
        { name: "About", path: "/about" },
        { name: "Playground", path: "/playground" }
      ],
      lab: { text: "Lab", url: "https://lab.leoparpeix.com" },
      contact: "lparpeix@gmail.com"
    },
    loader: {
      progressText: "World building",
      cursorIndication: ["Click", "to enable sound"]
    },
    orientation: {
      title: "Rotate your device",
      text: "For an optimal navigation, please turn your screen vertically."
    },
    footer: {
      titles: ["Let's create", "a remarkable", "journey"],
      titlesReveal: ["your gateway", "to excitement", "starts here !"],
      date: "Spring 2021",
      creditsBtn: "Credits",
      networks: [
        { name: "Instagram", url: "https://www.instagram.com/leo_parpeix" },
        { name: "lparpeix@gmail.com", url: "mailto:lparpeix@gmail.com" },
        { name: "Linkedin", url: "https://www.linkedin.com/in/leo-parpeix" }
      ],
      copyright: "© 2024",
      infos: "about this Portfolio",
      smallTexts: [
        ["A huge shout-out to <a target='_blank' class='text__link' href='https://twitter.com/LecornuThoma'>Thoma Lecornu</a>,", "who jumped onto this project with me."],
        ["His personality and determination", "were, for sure, one of the key elements", "in the success of this portfolio."],
        ["And, a big shout-out to <a target='_blank' class='text__link' href='https://www.instagram.com/vic.rou'>Victor</a>, <a target='_blank' class='text__link' href='https://www.linkedin.com/in/felix-sikora/'>Félix</a>", "and <a target='_blank' class='text__link' href='https://www.instagram.com/lucas_gssr/'>Lucas</a> for their patience and 3D", "crazy skills !"]
      ]
    }
  },

  home: {
    header: {
      description: "Driven by detail. Obsessed with seamless motion.",
      scrollIndication: "Scroll down",
      cameraParams: {
        scrollRangePosition: { x: 0, y: 2.4, z: 4 },
        scrollRangeRotation: { x: 0, y: 0, z: 0 },
        scrollOffsetPosition: { x: 0, y: 0, z: 0 },
        scrollOffsetRotation: { x: 0, y: 0, z: 0 }
      }
    },
    hero: {
      titles: ["French", "Interactive", "Designer"],
      titlesReveal: ["Creative", "Passionnate", "Art Director"],
      indication: "(Click to feed the bee)",
      city: "Raised in France <br> Designing worldwide",
      textAgency: ["Currently pushing design", "boundaries at", "and in freelance"],
      textFormer: "Former : ",
      agencies: [
        { name: "@Locomotive", url: "https://locomotive.ca" },
        { name: "@ImmersiveGarden", url: "https://immersive-g.com" }
      ]
    },
    intro: {
      bigTexts: [
        "Bonjour,",
        "I cherish simplicity, a touch of craziness, a unique identity & pixel-perfect animations."
      ],
      smallTexts: [
        "Hi there, it looks like you've landed on my portfolio.",
        "Whether you're curious about me, seeking inspiration, or just wandered in, I'm delighted to welcome you to my creative universe."
      ],
      urlReel: "/assets/medias/home/showreel-base/showreel.mp4",
      cursorIndication: "Watch Reel"
    },
    projects: [
      {
        title: "Selected projects",
        cursorIndication: "Drag",
        sectionType: "slider",
        projectIndex: 0,
        projectKey: "project1",
        name: "Creandum",
        type: "Finance",
        date: "2023",
        team: {
          text: "Team of 2",
          agency: { name: "@ImmersiveGarden", url: "https://immersive-g.com" }
        },
        projectLink: { text: "Project link", url: "https://creandum.com/" },
        roles: {
          text: "Roles",
          items: ["Art Director", "UI & Interactive Designer"]
        }
      },
      {
        cursorIndication: "Drag",
        sectionType: "slider",
        projectIndex: 1,
        projectKey: "project2",
        name: "Veillance",
        type: "(Technical clothing)",
        date: "2025",
        team: {
          text: "Team of 3",
          agency: { name: "Personal Research" }
        },
        roles: {
          text: "Roles",
          items: ["Art Director", "UI & Interactive Designer"]
        }
      },
      {
        cursorIndication: "Drag",
        sectionType: "slider",
        projectIndex: 2,
        projectKey: "project3",
        name: "Mechachain",
        type: "NFT",
        recognitions: ["Awwwards x1"],
        date: "2023",
        team: {
          text: "Team of 3",
          agency: { name: "@ImmersiveGarden", url: "https://immersive-g.com" }
        },
        roles: {
          text: "Roles",
          items: ["Art Director", "UI & Interactive Designer"]
        }
      },
      {
        sectionType: "webgl",
        textLines: ["Focus on", "innovation and", "user-centered", "design."],
        cameraParams: {
          scrollRangePosition: { x: 0, y: 2.75, z: 0 },
          scrollRangeRotation: { x: 0, y: 0, z: 0 },
          scrollOffsetPosition: { x: 0, y: 2.75, z: 0 },
          scrollOffsetRotation: { x: 0, y: 0, z: 0 }
        }
      },
      {
        cursorIndication: "Drag",
        sectionType: "slider",
        projectIndex: 3,
        projectKey: "project4",
        name: "Dulcedo",
        type: "Model & Talent Agency",
        recognitions: ["Awwwards x1"],
        date: "2025",
        team: {
          text: "Team of 4",
          agency: { name: "@Locomotive", url: "https://locomotive.ca" }
        },
        projectLink: { text: "Project link", url: "https://dulcedo.com" },
        roles: {
          text: "Roles",
          items: ["Art Director", "UI & Interactive Designer"]
        }
      },
      {
        cursorIndication: "Drag",
        sectionType: "slider",
        projectIndex: 4,
        projectKey: "project5",
        name: "Dioriviera",
        type: "(Model & Talent Agency)",
        recognitions: ["Awwwards x1", "FWA x1"],
        date: "2023",
        team: {
          text: "Team of 5",
          agency: { name: "@ImmersiveGarden", url: "https://immersive-g.com" }
        },
        projectLink: { text: "Project link", url: "http://dioriviera.imm-g-prod.com/dioriviera-2022" },
        roles: {
          text: "Roles",
          items: ["Art Director", "UI, 3D & Interactive Designer"]
        }
      },
      {
        cursorIndication: "Drag",
        sectionType: "slider",
        projectIndex: 5,
        projectKey: "project6",
        name: "Trebuchet",
        type: "(Studio Portfolio)",
        date: "2024",
        team: {
          text: "Team of 3",
          agency: { name: "@ImmersiveGarden", url: "https://immersive-g.com" }
        },
        projectLink: { text: "Project link", url: "https://www.trebuchet.fun" },
        roles: {
          text: "Roles",
          items: ["Art Director", "UI & Interactive Designer"]
        }
      }
    ] as Project[],

    archives: {
      title: "Archives",
      cursorIndication: "Discover More",
      items: [
        {
          name: "Gab",
          type: "Portfolio",
          roles: "UI & Interactive Design",
          date: "2026",
          agency: { name: "Freelance" },
          infos: [
            "A digital portfolio focused on user experience and micro-interactions, designed to enhance clarity, flow, and overall navigation fluidity.",
            "Every interactions are crafted to feel intentional, seamless, and intuitive, reinforcing content without disrupting the experience and keep the focus on the content."
          ],
          media: { url2: "/assets/medias/home/archives-base/7-PortfolioGab.mp4", isVideo: true }
        },
        {
          name: "Unity",
          type: "Design system",
          roles: "UI & Interactive Design",
          date: "2025",
          agency: { name: "Freelance" },
          infos: [
            "Design system & web design for Unity's new interactive showcase.",
            "Crafting clean layouts, refined typography, and high-performance interactive components."
          ],
          media: { url2: "/assets/medias/home/archives-base/8-Unity-2025.mp4", isVideo: true }
        },
        {
          name: "Pangaia",
          type: "E-commerce",
          roles: "Art Direction & 3D",
          date: "2024",
          agency: { name: "@Locomotive" },
          infos: ["Interactive sustainability experience connecting materials, design, and eco-responsibility."],
          media: { url2: "/assets/medias/home/archives-base/9-Pangaia.mp4", isVideo: true }
        },
        {
          name: "Merrell",
          type: "Footwear Campaign",
          roles: "Art Direction",
          date: "2024",
          agency: { name: "Freelance" },
          infos: ["Dynamic seasonal collection visual direction and micro-interaction design."],
          media: { url2: "/assets/medias/home/archives-base/11-Merrel.mp4", isVideo: true }
        },
        {
          name: "Tougo",
          type: "Healthcare Platform",
          roles: "Interactive Design",
          date: "2024",
          agency: { name: "@Locomotive" },
          infos: ["Engaging health and wellness journey designed to motivate active daily habits."],
          media: { url2: "/assets/medias/home/archives-base/13-Tougo.mp4", isVideo: true }
        },
        {
          name: "Drake Hotel",
          type: "Hospitality & Culture",
          roles: "UI & Interactive Design",
          date: "2024",
          agency: { name: "@Locomotive" },
          infos: ["Revitalizing an iconic cultural institution through fluid digital storytelling."],
          media: { url2: "/assets/medias/home/archives-base/14-DrakeHotel.mp4", isVideo: true }
        },
        {
          name: "Vooban",
          type: "AI & Engineering",
          roles: "Art Direction & UI",
          date: "2023",
          agency: { name: "@Locomotive" },
          infos: ["Positioning leading AI engineers with a bold, razor-sharp digital presence."],
          media: { url2: "/assets/medias/home/archives-base/15-Vooban.mp4", isVideo: true }
        },
        {
          name: "Auberge La Chatelaine",
          type: "Boutique Hotel",
          roles: "Branding & Web",
          date: "2023",
          agency: { name: "Freelance" },
          infos: ["Warmth, elegance, and timeless charm captured in a serene hotel experience."],
          media: { url2: "/assets/medias/home/archives-base/16-AubergerLaChatelaine.jpg", isVideo: false }
        },
        {
          name: "The Hay Adams",
          type: "Luxury Hospitality",
          roles: "UI & Interactive Design",
          date: "2023",
          agency: { name: "@Locomotive" },
          infos: ["Historic luxury facing the White House brought alive with editorial elegance."],
          media: { url2: "/assets/medias/home/archives-base/18-TheHayAdams.mp4", isVideo: true }
        },
        {
          name: "Prison Boss",
          type: "VR Game Launch",
          roles: "Art Direction & Web",
          date: "2023",
          agency: { name: "Freelance" },
          infos: ["Playful, eccentric promotion website matching the humor of the VR hit."],
          media: { url2: "/assets/medias/home/archives-base/19-PrisonBoss.mp4", isVideo: true }
        },
        {
          name: "Palosanto",
          type: "Music & Events",
          roles: "Visual Identity",
          date: "2023",
          agency: { name: "Freelance" },
          infos: ["Organic textures and soundwave-inspired rhythms for an underground music movement."],
          media: { url2: "/assets/medias/home/archives-base/20-Palosanto.mp4", isVideo: true }
        },
        {
          name: "Longines",
          type: "Horology",
          roles: "3D & Interactive Design",
          date: "2022",
          agency: { name: "@ImmersiveGarden" },
          infos: ["Celebrating Swiss precision and aviation heritage with 3D product rendering."],
          media: { url2: "/assets/medias/home/archives-base/21-Longines.mp4", isVideo: true }
        },
        {
          name: "Immersive Garden",
          type: "Agency Portfolio",
          roles: "Art Direction",
          date: "2022",
          agency: { name: "@ImmersiveGarden" },
          infos: ["Crafting the award-winning agency portfolio showcasing groundbreaking interactive projects."],
          media: { url2: "/assets/medias/home/archives-base/23-ImmersiveGarden.mp4", isVideo: true }
        },
        {
          name: "Longines DolceVita",
          type: "Luxury Campaign",
          roles: "Art Direction & 3D",
          date: "2022",
          agency: { name: "@ImmersiveGarden" },
          infos: ["Italian art of living represented through subtle light and golden ratio geometries."],
          media: { url2: "/assets/medias/home/archives-base/24-LonginesDolceVita.mp4", isVideo: true }
        },
        {
          name: "Omega",
          type: "Luxury Watchmaking",
          roles: "UI & 3D",
          date: "2022",
          agency: { name: "@ImmersiveGarden" },
          infos: ["Digital showcase of precision timepieces, movement calibers, and space exploration heritage."],
          media: { url2: "/assets/medias/home/archives-base/25-Omega.mp4", isVideo: true }
        },
        {
          name: "Aleph",
          type: "Web3 Innovation",
          roles: "Art Direction & Web",
          date: "2022",
          agency: { name: "Freelance" },
          infos: ["Futuristic decentralized cloud architecture explained through glowing schematic nodes."],
          media: { url2: "/assets/medias/home/archives-base/26-Aleph.mp4", isVideo: true }
        },
        {
          name: "Omexom",
          type: "Energy Infrastructure",
          roles: "UI Design",
          date: "2022",
          agency: { name: "Freelance" },
          infos: ["Visualizing power grids, energy transition initiatives, and global impact."],
          media: { url2: "/assets/medias/home/archives-base/27-Omexom.jpg", isVideo: false }
        },
        {
          name: "Tour de France",
          type: "B2B Showcase",
          roles: "Art Direction",
          date: "2022",
          agency: { name: "Freelance" },
          infos: [
            "A B2B landing page designed to present Tour de France audience figures in a clear and compelling way.",
            "The experience focuses on data readability, structured storytelling, and intuitive navigation."
          ],
          media: { url2: "/assets/medias/home/archives-base/28-TourDeFrance.mp4", isVideo: true }
        },
        {
          name: "Manza",
          type: "Video Agency",
          roles: "Branding",
          date: "2022",
          agency: { name: "Freelance" },
          infos: [
            "The goal of this project was to create an ecosystem around the agency's universe.",
            "Modern and raw graphic elements that showcase their videos while maintaining a sharp identity."
          ],
          media: { url2: "/assets/medias/home/archives-base/29-Manza.mp4", isVideo: true }
        }
      ] as ArchiveItem[]
    }
  },

  about: {
    header: {
      description: "Art director & Interactive Designer with 6+ years creating digital experiences.",
      scrollIndication: "Explore story"
    },
    hero: {
      titles: ["About", "Léo", "Parpeix"],
      indication: "Driven by passion, craft & curiosity",
      city: "Based in France / Working globally"
    },
    intro: {
      bigTexts: [
        "I bridge the gap between imagination, design systems, and bleeding-edge WebGL technology.",
        "From early creative concepts to final polish, every detail is considered."
      ],
      smallTexts: [
        "Having spent years working alongside top studios including Locomotive and Immersive Garden, I've honed a methodology rooted in narrative tension, clean typography, and fluid user feedback.",
        "My goal is never just to create a website, but to leave an impression that lingers."
      ],
      image: "/assets/medias/about/intro/intro.jpg"
    },
    experience: [
      { role: "Art Director & Designer", company: "Freelance", period: "2023 - Present" },
      { role: "Senior Interactive Designer", company: "Locomotive", period: "2022 - 2023" },
      { role: "Interactive Designer", company: "Immersive Garden", period: "2020 - 2022" },
      { role: "Digital Designer", company: "Trebuchet", period: "2019 - 2020" }
    ],
    awards: [
      "Awwwards Site of the Day x8",
      "Awwwards Developer Site of the Year Nominee",
      "FWA of the Day x6",
      "CSS Design Awards Site of the Day x12"
    ],
    content: {
      image: "/assets/medias/about/content/content.jpg",
      closingQuote: "Always seeking new challenges that push boundaries and redefine expectations."
    }
  },

  playground: {
    hero: {
      text: "A space for creative coding experiments, 3D explorations, and visual research."
    },
    items: [
      { id: 1, type: "video", src: "/assets/medias/playground/1.mp4", title: "Kinetic Glyphs", aspect: "16/9" },
      { id: 2, type: "video", src: "/assets/medias/playground/2.mp4", title: "Cloth Fluid Dynamics", aspect: "4/5" },
      { id: 3, type: "video", src: "/assets/medias/playground/3.mp4", title: "Volumetric Clouds", aspect: "1/1" },
      { id: 4, type: "video", src: "/assets/medias/playground/4.mp4", title: "Raymarched Fractals", aspect: "16/9" },
      { id: 5, type: "video", src: "/assets/medias/playground/5.mp4", title: "Organic Particles", aspect: "4/5" },
      { id: 6, type: "image", src: "/assets/medias/playground/6.jpg", title: "Type Deconstruction", aspect: "1/1" },
      { id: 7, type: "image", src: "/assets/medias/playground/7.jpg", title: "Metallic Shaders", aspect: "16/9" },
      { id: 8, type: "image", src: "/assets/medias/playground/8.jpg", title: "Procedural Landscapes", aspect: "4/5" },
      { id: 9, type: "video", src: "/assets/medias/playground/9.mp4", title: "Interactive Flora", aspect: "1/1" },
      { id: 10, type: "image", src: "/assets/medias/playground/10.jpg", title: "Subsurface Scattering", aspect: "16/9" },
      { id: 11, type: "video", src: "/assets/medias/playground/11.mp4", title: "Audio Reactive Meshes", aspect: "4/5" },
      { id: 12, type: "image", src: "/assets/medias/playground/12.jpg", title: "Glass Refractions", aspect: "1/1" },
      { id: 13, type: "image", src: "/assets/medias/playground/13.jpg", title: "Chromatic Aberration Studies", aspect: "16/9" },
      { id: 14, type: "video", src: "/assets/medias/playground/14.mp4", title: "Cellular Automata", aspect: "4/5" },
      { id: 15, type: "video", src: "/assets/medias/playground/15.mp4", title: "Orbital Gravity Simulations", aspect: "1/1" }
    ] as PlaygroundItem[]
  }
};
