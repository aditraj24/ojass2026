import { IconType } from "react-icons";
import { BiSolidCalendarEvent } from "react-icons/bi";
import {
    FaFacebook,
    FaHome,
    FaInstagram,
    FaLinkedin,
    FaTrophy,
    FaYoutube,
} from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { RiGalleryFill } from "react-icons/ri";

export type Theme = "utopia" | "dystopia";

export type DayKey = 1 | 2 | 3 | 4;

export type Icons = { title: string; element: IconType }[];

export const NavItems: Icons = [
    { title: "Home", element: FaHome },
    { title: "Events", element: BiSolidCalendarEvent },
    { title: "Gallery", element: RiGalleryFill },
    { title: "Winners", element: FaTrophy },
    { title: "Team", element: IoPeopleSharp },
];

export const SocialMediaItems: Icons = [
    { title: "Instagram", element: FaInstagram },
    { title: "YouTube", element: FaYoutube },
    { title: "LinkedIn", element: FaLinkedin },
    { title: "Facebook", element: FaFacebook },
];

export interface GalleryImage {
    src: string;
    caption: string;
}

export const galleryImages: GalleryImage[] = [
    { src: "_DSC1744(1).jpg", caption: "OJASS 2025 Glimpse" },
    // { src: "ASH04128(1).jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC1322.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC1327.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC1490.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC1652.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC1653.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC1900 - Copy.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC1900.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-_DSC2002.jpg", caption: "OJASS 2025 Glimpse" },
    {
        src: "compressed-20241117_192238 - Copy.jpg",
        caption: "OJASS 2025 Glimpse",
    },
    { src: "compressed-ASH04152 - Copy.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-DSC_0663.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-DSC02484 - Copy.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-DSC02980.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-DSC03232.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-IMG_0042 - Copy.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-DSC03282.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-IMG_0250 - Copy.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-IMG_0252 - Copy.jpg", caption: "OJASS 2025 Glimpse" },
    { src: "compressed-IMG_0319.jpg", caption: "OJASS 2025 Glimpse" },
    // { src: "DSC_1834.JPG", caption: "OJASS 2025 Glimpse" },
    // { src: "DSC02477(1).jpg", caption: "OJASS 2025 Glimpse" },
    // { src: "DSC02515.JPG", caption: "OJASS 2025 Glimpse" },
    { src: "DSC05141(1).jpg", caption: "OJASS 2025 Glimpse" },
    { src: "DSC05026(1).jpg", caption: "OJASS 2025 Glimpse" },
    { src: "DSC05195(1).jpg", caption: "OJASS 2025 Glimpse" },
    // { src: "IMG_0215(1).jpg", caption: "OJASS 2025 Glimpse" },
    // { src: "IMG_9939(1).jpg", caption: "OJASS 2025 Glimpse" },
    // { src: "IMG_9968(1).jpg  ", caption: "OJASS 2025 Glimpse" },
];

export interface GalleryCell {
    x: number;
    y: number;
    w: number;
    h: number;
}

export const galleryLayout: GalleryCell[] = [
    { x: 71, y: 58, w: 400, h: 270 },
    { x: 211, y: 255, w: 540, h: 360 },
    { x: 631, y: 158, w: 400, h: 270 },
    { x: 351, y: 687, w: 260, h: 290 },
    { x: 911, y: 540, w: 260, h: 350 },
    { x: 71, y: 922, w: 350, h: 260 },
    { x: 1200, y: 100, w: 520, h: 380 },
    { x: 2200, y: 100, w: 600, h: 400 },
    { x: 1480, y: 600, w: 450, h: 320 },
    { x: 1900, y: 750, w: 380, h: 520 },
    { x: 2400, y: 650, w: 550, h: 380 },
    { x: 2800, y: 300, w: 320, h: 600 },
    { x: 200, y: 1300, w: 600, h: 420 },
    { x: 750, y: 1200, w: 480, h: 350 },
    { x: 1200, y: 1450, w: 420, h: 420 },
    { x: 1700, y: 1300, w: 550, h: 400 },
    { x: 2300, y: 1200, w: 400, h: 580 },
    { x: 2750, y: 1100, w: 350, h: 350 },
    { x: 500, y: 1650, w: 300, h: 250 },
    { x: 2100, y: 1800, w: 600, h: 240 },
    { x: 1500, y: 1000, w: 250, h: 200 },
    { x: 2700, y: 50, w: 400, h: 220 },
    { x: 2900, y: 1550, w: 240, h: 380 },
    { x: 100, y: 1750, w: 350, h: 200 },
    { x: 1800, y: 50, w: 350, h: 180 },
];

type EventLocations =
    | "LECTURE HALL COMPLEX"
    | "COMPUTER CENTRE"
    | "DOWNS GROUND"
    | "STUDENT ACTIVITY CENTRE"
    | "OPEN AIR THEATRE"
    | "PARKING LOT";

export type TimelineData = {
    [K in DayKey]: {
        title: string;
        date: Date;
        events: {
            id: number;
            title: string;
            location: EventLocations;
            coords: { x: number; y: number };
            start: Date;
            end: Date;
            desc: string;
        }[];
    };
};

export type WinnerTeam = {
    team_name: string;
    members: string[];
    ojass_ids: string[];
};

export type WinnerEntry = {
    id: number;
    event_name: string;
    winner?: WinnerTeam;
    runner_up?: WinnerTeam;
    second_runner_up?: WinnerTeam;
};

export type WinnerData = WinnerEntry[];

export const timelineData: TimelineData = {
    1: {
        title: "Day 1 - Thursday",
        date: new Date("2026-02-26T00:00:00"),
        events: [
            {
                id: 1,
                title: "OJASS OLYMPIAD",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 10, y: 20 },
                start: new Date("2026-02-26T09:00:00"),
                end: new Date("2026-02-26T12:00:00"),
                desc: "A competitive academic examination that assesses aptitude in mathematics and science. Evaluates conceptual understanding, logic, and problem-solving skills through time-bound objective testing.",
            },
            {
                id: 2,
                title: "AI HACKATHON",
                location: "COMPUTER CENTRE",
                coords: { x: 30, y: 15 },
                start: new Date("2026-02-26T09:00:00"),
                end: new Date("2026-02-26T21:00:00"),
                desc: "An applied AI challenge using Python to build, tune, and evaluate machine learning models on real datasets. Emphasizes practical AI skills, data preprocessing, algorithm selection, and performance benchmarking.",
            },
            {
                id: 3,
                title: "COZMO CLENCH",
                location: "OPEN AIR THEATRE",
                coords: { x: 50, y: 30 },
                start: new Date("2026-02-26T09:00:00"),
                end: new Date("2026-02-26T11:00:00"),
                desc: "A hands-on robotics challenge with manually controlled bots gripping objects, navigating obstacles, and completing precision tasks. Evaluated on mechanical design, control accuracy, and time efficiency.",
            },
            {
                id: 4,
                title: "RURAL TECH IDEATHON",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 70, y: 20 },
                start: new Date("2026-02-26T11:00:00"),
                end: new Date("2026-02-26T13:30:00"),
                desc: "An innovation-driven ideathon designing practical technology solutions for rural problems. Teams advance through idea presentation and prototype stages, emphasizing feasibility and social impact.",
            },
            {
                id: 5,
                title: "BUSINESS SIMULATION",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 90, y: 30 },
                start: new Date("2026-02-26T13:30:00"),
                end: new Date("2026-02-26T16:30:00"),
                desc: "A strategy-driven challenge building and managing complete business models from branding to operations. Teams design workflows, pricing strategies, and respond to real-time business crises.",
            },
            {
                id: 6,
                title: "SANRACHNA",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 80, y: 60 },
                start: new Date("2026-02-26T14:00:00"),
                end: new Date("2026-02-26T17:00:00"),
                desc: "A hands-on engineering challenge applying structural concepts to design and construct functional bridges. Tests creativity, precision, and problem-solving with limited materials under time constraints.",
            },
            {
                id: 7,
                title: "TRACE BOT CHALLENGE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 60, y: 50 },
                start: new Date("2026-02-26T13:00:00"),
                end: new Date("2026-02-26T17:00:00"),
                desc: "An autonomous robotics challenge with line-following robots navigating complex tracks. Evaluated on path optimization, speed, and reliability through sensor integration and algorithmic control.",
            },
            {
                id: 8,
                title: "THE FORGE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 40, y: 60 },
                start: new Date("2026-02-26T14:00:00"),
                end: new Date("2026-02-26T17:00:00"),
                desc: "A high-intensity business quiz simulating premier corporate competition format and rigor. Teams progress through written preliminaries to on-stage finals testing business awareness and analytical thinking.",
            },
            {
                id: 9,
                title: "KURUKSHETRA - ROBO WARS (QUALIFIERS)",
                location: "PARKING LOT",
                coords: { x: 20, y: 50 },
                start: new Date("2026-02-26T14:00:00"),
                end: new Date("2026-02-26T22:00:00"),
                desc: "A high-intensity robotics combat challenge with remote-controlled fighting robots across weight categories. Tests mechanical design, control systems, weapon integration, and strategic aggression.",
            },
        ],
    },
    2: {
        title: "Day 2 - Friday",
        date: new Date("2026-02-27T00:00:00"),
        events: [
            {
                id: 10,
                title: "HACK DE SCIENCE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 10, y: 20 },
                start: new Date("2026-02-27T09:00:00"),
                end: new Date("2026-02-28T21:00:00"),
                desc: "A 36-hour offline hackathon where teams design and build fully functional web applications. Emphasizes teamwork, problem-solving, and practical development skills for real-world challenges.",
            },
            {
                id: 11,
                title: "THE GREAT INDIAN MELA",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 30, y: 30 },
                start: new Date("2026-02-27T09:00:00"),
                end: new Date("2026-02-27T12:00:00"),
                desc: "A lively quiz celebrating Indian and global pop culture across music, entertainment, and arts. Features diverse quiz formats testing knowledge depth and quick thinking in an engaging atmosphere.",
            },
            {
                id: 12,
                title: "MAZE MARATHON",
                location: "OPEN AIR THEATRE",
                coords: { x: 70, y: 30 },
                start: new Date("2026-02-27T09:00:00"),
                end: new Date("2026-02-27T11:00:00"),
                desc: "An autonomous robotics challenge with intelligent robots navigating complex mazes to reach centers in minimum time. Tests path-planning algorithms, sensor integration, and real-time decision-making.",
            },
            {
                id: 13,
                title: "MOCK IPL AUCTION",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 90, y: 20 },
                start: new Date("2026-02-27T12:30:00"),
                end: new Date("2026-02-27T15:30:00"),
                desc: "A strategic simulation experiencing the thrill of building competitive T20 teams through real-time auctions. Manages virtual budgets and evaluates player statistics for calculated bidding decisions.",
            },
            {
                id: 14,
                title: "FC-24",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 100, y: 50 },
                start: new Date("2026-02-27T11:00:00"),
                end: new Date("2026-02-27T13:30:00"),
                desc: "A competitive one-on-one football gaming event testing strategic decision-making and in-game adaptability. Players compete on standardized settings emphasizing sportsmanship and skill-based performance.",
            },
            {
                id: 15,
                title: "CHESS",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 80, y: 60 },
                start: new Date("2026-02-27T14:00:00"),
                end: new Date("2026-02-27T17:00:00"),
                desc: "A competitive chess tournament combining strategic depth with structured progression from online qualifiers to over-the-board finals. Emphasizes analytical thinking, discipline, and sportsmanship.",
            },
            {
                id: 16,
                title: "FINITE ELEMENT ANALYSIS",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 60, y: 70 },
                start: new Date("2026-02-27T11:00:00"),
                end: new Date("2026-02-27T13:30:00"),
                desc: "A technical design challenge testing skills in 3D modeling, drafting, and finite element analysis. Teams create precise mechanical models and evaluate structural performance using industry-standard software.",
            },
            {
                id: 17,
                title: "FRAMES & TALES",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 50, y: 50 },
                start: new Date("2026-02-27T14:00:00"),
                end: new Date("2026-02-27T17:00:00"),
                desc: "A creative photography challenge transforming themes into compelling visual narratives. Combines technical photography with storytelling to produce cohesive, time-limited photo sequences.",
            },
            {
                id: 18,
                title: "CASE STUDY CHALLENGE",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 20, y: 50 },
                start: new Date("2026-02-27T14:00:00"),
                end: new Date("2026-02-27T17:00:00"),
                desc: "A competitive data analytics challenge solving real-world business problems with practical datasets. Teams generate insights and propose data-driven solutions through analytical rigor and innovation.",
            },
            {
                id: 19,
                title: "KURUKSHETRA - ROBO WARS (FINALS)",
                location: "PARKING LOT",
                coords: { x: 20, y: 80 },
                start: new Date("2026-02-27T17:00:00"),
                end: new Date("2026-02-27T21:00:00"),
                desc: "The final combat showdown of remote-controlled fighting robots competing for championship glory. Battles test mechanical design, weapon systems, and strategic combat under intense competitive pressure.",
            },
        ],
    },
    3: {
        title: "Day 3 - Saturday",
        date: new Date("2026-02-28T00:00:00"),
        events: [
            {
                id: 20,
                title: "NO GROUND ZONE - RC PLANE CONTEST",
                location: "DOWNS GROUND",
                coords: { x: 15, y: 25 },
                start: new Date("2026-02-28T09:00:00"),
                end: new Date("2026-02-28T11:00:00"),
                desc: "An aerial engineering challenge designing and operating RC aircraft to maximize payload capacity and drop accuracy. Evaluated through design reporting and flight rounds testing performance and precision.",
            },
            {
                id: 21,
                title: "START UP IDEATHON",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 35, y: 15 },
                start: new Date("2026-02-28T09:00:00"),
                end: new Date("2026-02-28T12:00:00"),
                desc: "An entrepreneurial pitching platform presenting innovative startup ideas with structured business models. Teams progress from pitch deck submissions to live presentations evaluated by judges and industry experts.",
            },
            {
                id: 22,
                title: "VALORANT",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 55, y: 25 },
                start: new Date("2026-02-28T09:00:00"),
                end: new Date("2026-02-28T11:00:00"),
                desc: "A high-intensity tactical shooter tournament challenging teams in competitive 5v5 format. Delivers professional BYOC esports experience emphasizing strategy, coordination, and mechanical skill.",
            },
            {
                id: 23,
                title: "DRONE RACE CHALLENGE",
                location: "DOWNS GROUND",
                coords: { x: 75, y: 15 },
                start: new Date("2026-02-28T16:00:00"),
                end: new Date("2026-02-28T18:00:00"),
                desc: "A high-speed aerial racing challenge piloting drones through demanding obstacle courses against the clock. Tests precision flying, control, and strategic navigation across qualifying and final rounds.",
            },
            {
                id: 24,
                title: "ROBO SOCCER",
                location: "OPEN AIR THEATRE",
                coords: { x: 85, y: 55 },
                start: new Date("2026-02-28T11:00:00"),
                end: new Date("2026-02-28T17:00:00"),
                desc: "A competitive robotics sport where teams design robots to maneuver balls and score goals in head-to-head arenas. Tests robot control, mechanical design, and precision under strict constraints.",
            },
            {
                id: 25,
                title: "BGMI",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 65, y: 65 },
                start: new Date("2026-02-28T16:00:00"),
                end: new Date("2026-02-28T19:00:00"),
                desc: "A competitive battle royale gaming event challenging strategy, teamwork, and decision-making. Teams compete through qualifiers and finals with structured scoring based on placement and eliminations.",
            },
            {
                id: 26,
                title: "VISHWA CODE MANIA",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 45, y: 75 },
                start: new Date("2026-02-28T09:00:00"),
                end: new Date("2026-02-28T13:00:00"),
                desc: "A high-intensity competitive programming contest challenging teams to solve algorithmic problems. Uses ICPC-style scoring to test logic, efficiency, and time management under offline-style discipline.",
            },
            {
                id: 27,
                title: "PIXEL SYNC",
                location: "COMPUTER CENTRE",
                coords: { x: 25, y: 65 },
                start: new Date("2026-02-28T15:00:00"),
                end: new Date("2026-02-28T19:00:00"),
                desc: "A fast-paced UI/UX hackathon where teams design and build complete frontend interfaces from scratch. Combines design thinking and technical execution for responsive, user-focused results.",
            },
            {
                id: 28,
                title: "CINESCRIPT",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 50, y: 45 },
                start: new Date("2026-02-28T11:00:00"),
                end: new Date("2026-02-28T13:00:00"),
                desc: "A fast-paced short film challenge where teams conceptualize, shoot, and edit original films within defined timeframes. Celebrates creativity, technical excellence, and emotional resonance through pure storytelling.",
            },
            {
                id: 29,
                title: "FIX-IT FIESTA",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 20, y: 45 },
                start: new Date("2026-02-28T11:00:00"),
                end: new Date("2026-02-28T13:30:00"),
                desc: "A quality-focused innovation challenge redesigning existing products to enhance performance and user experience. Teams apply quality improvement principles to propose structured, value-driven solutions.",
            },
        ],
    },
    4: {
        title: "Day 4 - Sunday",
        date: new Date("2026-03-01T00:00:00"),
        events: [
            {
                id: 30,
                title: "AQUA RACE",
                location: "DOWNS GROUND",
                coords: { x: 20, y: 20 },
                start: new Date("2026-03-01T09:00:00"),
                end: new Date("2026-03-01T11:00:00"),
                desc: "A fast-paced aquatic robotics challenge with electronic boats navigating zigzag watercourses. Tests control, stability, and engineering efficiency through precision maneuvering and speed.",
            },
            {
                id: 31,
                title: "SIMULATION SPRINT",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 40, y: 30 },
                start: new Date("2026-03-01T09:00:00"),
                end: new Date("2026-03-01T11:00:00"),
                desc: "A high-intensity technical challenge testing practical MATLAB expertise through progressive problem-solving. Competitors build and simulate real-world digital communication systems with engineering rigor.",
            },
            {
                id: 32,
                title: "ULYSSES",
                location: "LECTURE HALL COMPLEX",
                coords: { x: 60, y: 20 },
                start: new Date("2026-03-01T09:00:00"),
                end: new Date("2026-03-01T11:00:00"),
                desc: "A creative storytelling challenge testing imagination, adaptability, and narrative skills through engaging rounds. Teams craft stories using visual prompts, questions, and emotional twists with unexpected elements.",
            },
            {
                id: 33,
                title: "UNDER WATER TRACING",
                location: "DOWNS GROUND",
                coords: { x: 80, y: 30 },
                start: new Date("2026-03-01T11:00:00"),
                end: new Date("2026-03-01T13:00:00"),
                desc: "An advanced underwater robotics challenge with compact waterproof robots navigating controlled pool arenas. Tests maneuverability, precision, and autonomous capabilities in dynamic aquatic environments.",
            },
            {
                id: 34,
                title: "LIGHTS, CAMERA, OJASS!",
                location: "STUDENT ACTIVITY CENTRE",
                coords: { x: 80, y: 60 },
                start: new Date("2026-03-01T11:00:00"),
                end: new Date("2026-03-01T13:00:00"),
                desc: "An on-the-spot short-form video challenge capturing the fest's energy through creative reels. Teams document events and transform highlights into engaging visual stories within defined timeframes.",
            },
            {
                id: 35,
                title: "ROBO RUMBLE",
                location: "DOWNS GROUND",
                coords: { x: 60, y: 70 },
                start: new Date("2026-03-01T13:00:00"),
                end: new Date("2026-03-01T16:00:00"),
                desc: "An all-terrain robotics challenge testing mechanical design and control across rugged obstacle courses. Emphasizes engineering innovation, reliability, and adaptability under competitive pressure.",
            },
            {
                id: 36,
                title: "FLOW FORGE",
                location: "COMPUTER CENTRE",
                coords: { x: 40, y: 60 },
                start: new Date("2026-03-01T09:00:00"),
                end: new Date("2026-03-01T13:00:00"),
                desc: "A hands-on automation challenge designing smart workflows using no-code and low-code automation tools. Teams integrate APIs and create efficient multi-step automated systems through live demonstrations.",
            },
        ],
    },
};

interface EventPerk {
    prefix?: string;
    bold?: string;
    suffix?: string;
}
export type RegistrationTier = "NIT_JSR" | "OTHER_COLLEGE";

const INTERNAL_STUDENT_PERKS: EventPerk[] = [
    { prefix: "Free registration to all ", bold: "Individual Events" },
    { prefix: "Free registration to all ", bold: "Team Events" },
    { prefix: "Exclusive ", bold: "OJASS Goodies" },
];

const EXTERNAL_STUDENT_PERKS: EventPerk[] = [
    { bold: "4-day Accommodation", suffix: " at NIT Jamshedpur campus" },
    {
        prefix: "Registration to all ",
        bold: "40+ Events",
        suffix: " (Individual & Team)",
    },
    { prefix: "Access to all", bold: " Cultural Nights & Talk Shows" },
    { bold: "3-time Meals", suffix: " (Breakfast, Lunch & Dinner)" },
    { bold: "Free Food Coupons", suffix: " for snacks & refreshments" },
    { prefix: "Exclusive ", bold: "OJASS Goodies" },
];

export const REGISTRATION_TIER_CONFIG: {
    [K in RegistrationTier]: EventPerk[];
} = {
    NIT_JSR: INTERNAL_STUDENT_PERKS,
    OTHER_COLLEGE: EXTERNAL_STUDENT_PERKS,
};

export const WinnerData: WinnerData = [
    {
        id: 0,
        event_name: "OJASS OLYMPIAD",
        winner: {
            team_name: "Individual",
            members: ["Rishabh Raj"],
            ojass_ids: ["OJASS26SQD8"],
        },
        runner_up: {
            team_name: "Individual",
            members: ["Neeladri Sadhu"],
            ojass_ids: ["OJASS26DYWA"],
        },
    },
    {
        id: 1,
        event_name: "VISHWA CODE MANIA",
        winner: {
            team_name: "N-LOG-N",
            members: ["Utkarsh Jha", "Shubham Gupta", "Satya Jay"],
            ojass_ids: ["OJASS26GFV8", "OJASS26XIUU", "OJASS264EWC"],
        },
        runner_up: {
            team_name: "WE DONT WIN",
            members: ["Manbendra Singh", "Md Mahtab Ansari", "Shaishav Singh"],
            ojass_ids: ["OJASS2663IH", "OJASS26Z5N1", "OJASS26K4M5"],
        },
    },
    {
        id: 2,
        event_name: "CHESS",
        winner: {
            team_name: "Individual",
            members: ["Rohit Mishra"],
            ojass_ids: ["OJASS264S6J"],
        },
        runner_up: {
            team_name: "Individual",
            members: ["Prem Kumar"],
            ojass_ids: ["OJASS26RO1K"],
        },
    },
    {
        id: 3,
        event_name: "AI HACKATHON",
        winner: {
            team_name: "Latent Space",
            members: ["Kanta Vishnu Madhav", "Chandra Viharika Ravila"],
            ojass_ids: ["OJASS26RZD4", "OJASS26GJND"],
        },
        runner_up: {
            team_name: "The Optimizers",
            members: ["Harshit Kumar", "Swayam Agarwal", "Rishav Kashyap"],
            ojass_ids: ["OJASS26FZ80", "OJASS26OM11", "OJASS267S63"],
        },
    },
    {
        id: 4,
        event_name: "RURAL TECH IDEATHON (SCHOOL - CATEGORY A)",
        winner: {
            team_name: "Team DAV",
            members: [
                "Devanshu Swami",
                "Abhinav Mukherjee",
                "Rishav Raj",
                "Neeladri Sadhu",
            ],
            ojass_ids: [
                "OJASS263XY9",
                "OJASS261OKV",
                "OJASS26SQD8",
                "OJASS26DYWA",
            ],
        },
    },
    {
        id: 4,
        event_name: "RURAL TECH IDEATHON (COLLEGE - CATEGORY B)",
        winner: {
            team_name: "Mechpitch",
            members: ["Alok Dey", "Priya Yadav", "Sagar Kumar Saw"],
            ojass_ids: ["OJASS268DNR", "OJASS26JGKC", "OJASS26K3AO"],
        },
        runner_up: {
            team_name: "Microwheels",
            members: [
                "Dhirendra Pratap Dindoure",
                "Shubham Gupta",
                "Shristy Shreya",
            ],
            ojass_ids: ["OJASS26PX9O", "OJASS26XIUU", "OJASS269VWR"],
        },
    },
    {
        id: 5,
        event_name: "SANRACHNA",
        winner: {
            team_name: "ENIGMA HUNTERS",
            members: [
                "Ashish Kumar",
                "Sahil Yadav",
                "Roshan Kumar",
                "Yash Labh",
            ],
            ojass_ids: [
                "OJASS26N7TE",
                "OJASS264F80",
                "OJASS26FN5Z",
                "OJASS26TKEQ",
            ],
        },
        runner_up: {
            team_name: "GALGOTIA BUILDERS",
            members: [
                "Rahul Prasad Prajapati",
                "Manas",
                "Shiv Shankar",
                "Shishir Dwivedi",
            ],
            ojass_ids: [
                "OJASS26PTA8",
                "OJASS265J4T",
                "OJASS26RXEQ",
                "OJASS26VBYI",
            ],
        },
        second_runner_up: {
            team_name: "TRUSS ISSUE",
            members: [
                "Shreya Mukesh Jaiswal",
                "Shivani Sinha",
                "Sadamsetty Praneeth",
                "Saniya Chouhan",
            ],
            ojass_ids: [
                "OJASS26SQXG",
                "OJASS26A03T",
                "OJASS26TIIB",
                "OJASS267BI8",
            ],
        },
    },
    {
        id: 6,
        event_name: "PIXEL SYNC",
        winner: {
            team_name: "Designer Tripod",
            members: ["Abhishek Anand", "Manish Kumar", "Priyanshu Singh"],
            ojass_ids: ["OJASS26XYOB", "OJASS26NTTR", "OJASS262B37"],
        },
        runner_up: {
            team_name: "Pixel_Perfects",
            members: ["Yashi Piparsaniya", "Sisanta Chhatoi", "Satya Jay"],
            ojass_ids: ["OJASS267M8Q", "OJASS260RF1", "OJASS264EWC"],
        },
    },
    {
        id: 7,
        event_name: "FLOW FORGE",
        winner: {
            team_name: "CodeCatalyst",
            members: ["Shambhawi Singh", "Darshit Naulakha"],
            ojass_ids: ["OJASS26IKEM", "OJASS26192F"],
        },
        runner_up: {
            team_name: "GenOps",
            members: [
                "Akash Verma",
                "Abhas Kumar Bardhan",
                "Kunal Singh Marwaha",
            ],
            ojass_ids: ["OJASS26KCRB", "OJASS26C5OT", "OJASS26JDJ3"],
        },
    },
    {
        id: 8,
        event_name: "TRACE BOT CHALLENGE",
        winner: {
            team_name: "Individual",
            members: ["Nilanjana Dutta"],
            ojass_ids: ["OJASS26BBSV"],
        },
        runner_up: {
            team_name: "Individual",
            members: ["Animesh Kumar"],
            ojass_ids: ["OJASS26OB19"],
        },
    },
    {
        id: 9,
        event_name: "ROBO RUMBLE",
        winner: {
            team_name: "Metal Gears B",
            members: ["Somnath S", "Aman Chandrakar"],
            ojass_ids: ["OJASS26FYF9", "OJASS26BB5F"],
        },
        runner_up: {
            team_name: "Mechanix",
            members: [
                "Mridul Maurya",
                "Shreyas Shray",
                "Abhas Mishra",
                "Ketan Ranjan Sui",
            ],
            ojass_ids: [
                "OJASS26OJ4L",
                "OJASS260MC7",
                "OJASS260O5Q",
                "OJASS26QTT9",
            ],
        },
    },
    {
        id: 10,
        event_name: "HACK DE SCIENCE",
        winner: {
            team_name: "Modi Sarkar",
            members: [
                "Utkarsh Singh",
                "Tanishk S Pandey",
                "Adarsh Kumar",
                "Ruchika Sinha",
            ],
            ojass_ids: [
                "OJASS26B5KV",
                "OJASS26ZHPI",
                "OJASS26JF9Z",
                "OJASS2668GS",
            ],
        },
        runner_up: {
            team_name: "Bit Set",
            members: ["Rishav Kashyap", "Awaish Ehsan", "Aditya Raj"],
            ojass_ids: ["OJASS267S63", "OJASS26TLNK", "OJASS26178M"],
        },
    },
    {
        id: 11,
        event_name: "ULYSSES",
        winner: {
            team_name: "GOD",
            members: ["Deeptanshu Singh Negi", "Yash Labh"],
            ojass_ids: ["OJASS26L5QF", "OJASS26TKEQ"],
        },
        runner_up: {
            team_name: "Twin Quills",
            members: ["Priyanshi", "Suyash Shandilya"],
            ojass_ids: ["OJASS26VHLC", "OJASS260DTK"],
        },
    },
    {
        id: 12,
        event_name: "UNDER WATER TRACING",
        winner: {
            team_name: "Depthwalker",
            members: [
                "Suraj Kumar",
                "Tejas Kumar",
                "Mridul Maurya",
                "Shreyas Shrey",
            ],
            ojass_ids: [
                "OJASS26236I",
                "OJASS26BKHD",
                "OJASS260J4L",
                "OJASS260MC7",
            ],
        },
        runner_up: {
            team_name: "Pirates of NITJSR",
            members: [
                "Akshat Kumar",
                "Abhishek Rajendra Tribhuvan",
                "Aditya Raj",
                "Sonu",
            ],
            ojass_ids: [
                "OJASS263105",
                "OJASS26ZGGE",
                "OJASS26HQIM",
                "OJASS26FWQ8",
            ],
        },
    },
    {
        id: 13,
        event_name: "MOCK TATA CRUCIBLE",
        winner: {
            team_name: "Unknown",
            members: ["Shiv Shankar", "Yash Labh"],
            ojass_ids: ["OJASS26RXEQ", "OJASS26TKEQ"],
        },
        runner_up: {
            team_name: "Tata Bye Bye",
            members: ["Priyanshu Gupta", "Abhishek Tribhuwan"],
            ojass_ids: ["OJASS2658HC", "OJASS26ZGGE"],
        },
    },
    {
        id: 14,
        event_name: "THE GREAT INDIAN MELA",
        winner: {
            team_name: "Mela Drama",
            members: ["Neha", "Raunak Srivastava"],
            ojass_ids: ["OJASS26GZNG", "OJASS26OIQB"],
        },
        runner_up: {
            team_name: "No Clew Crew",
            members: ["Shiv Shankar", "Yash Labh"],
            ojass_ids: ["OJASS26RXEQ", "OJASS26TKEQ"],
        },
    },
    {
        id: 15,
        event_name: "FIX-IT FIESTA",
        winner: {
            team_name: "Team Optiminds",
            members: [
                "Kunal Singh Marwaha",
                "Akash Verma",
                "Abhas Kumar Bardhan",
            ],
            ojass_ids: ["OJASS26JDJ3", "OJASS26KCRB", "OJASS26C5OT"],
        },
        runner_up: {
            team_name: "Team Vahan Parichay",
            members: ["Debangshu Mondal", "Amandeep", "Suniti Saw"],
            ojass_ids: ["OJASS26N9LT", "OJASS26L004", "OJASS26R87G"],
        },
        second_runner_up: {
            team_name: "Team ScaleUp Squade",
            members: ["Anushka Garg", "Raja Kumar"],
            ojass_ids: ["OJASS26XFNI", "OJASS266E1H"],
        },
    },
    {
        id: 16,
        event_name: "EAFC",
        winner: {
            team_name: "Individual",
            members: ["Anoop Kumar Burnwal"],
            ojass_ids: ["OJASS26YRKG"],
        },
        runner_up: {
            team_name: "Individual",
            members: ["Inayat"],
            ojass_ids: ["OJASS260DIB"],
        },
    },
    {
        id: 17,
        event_name: "CASE STUDY CHALLENGE",
        winner: {
            team_name: "Team DeepTrace",
            members: ["Tushar Das"],
            ojass_ids: ["OJASS261GVA"],
        },
        runner_up: {
            team_name: "Team whattheHACK ",
            members: [
                "Mohammad Saad Haque Ansari",
                "Aayan Hasim",
                "Shreya Sekseria",
                "Parisha Roy",
            ],
            ojass_ids: [
                "OJASS26S4L2",
                "OJASS26UZC4",
                "OJASS26F4PI",
                "OJASS265Q1T",
            ],
        },
    },
    {
        id: 18,
        event_name: "SIMULATION SPRINT",
        winner: {
            team_name: "Individual",
            members: ["Tanishq Tanmay"],
            ojass_ids: ["OJASS264IJX"],
        },
        runner_up: {
            team_name: "Individual",
            members: ["Kumari Lipsa"],
            ojass_ids: ["OJASS26AX32"],
        },
    },
    {
        id: 19,
        event_name: "BGMI",
        winner: {
            team_name: "Xian Ternousha",
            members: [
                "Kislai Bramhbhatt",
                "Shreyas Kumar",
                "Vansh Agastya",
                "Mohammad Shahid Khan",
            ],
            ojass_ids: [
                "OJASS265W9I",
                "OJASS26OC1V",
                "OJASS26IMB9",
                "OJASS26AR1N",
            ],
        },
        runner_up: {
            team_name: "RED_ZONE",
            members: [
                "Abhas Mishra",
                "Mridul Maurya",
                "Ketan Sui",
                "Shreyas Shrey",
            ],
            ojass_ids: [
                "OJASS260O5Q",
                "OJASS26OJ4L",
                "OJASS26QTT9",
                "OJASS260MC7",
            ],
        },
    },
    {
        id: 20,
        event_name: "VALORANT",
        winner: {
            team_name: "BloodRush",
            members: [
                "Aditya Raj",
                "Riyan Roy",
                "Yash Raj",
                "Ujjawal Kumar",
                "Rigzin Chhospel",
            ],
            ojass_ids: [
                "OJASS26W9F3",
                "OJASS26CRT2",
                "OJASS2641EC",
                "OJASS26YQ3M",
                "OJASS260SMR",
            ],
        },
        runner_up: {
            team_name: "Wolfsbane",
            members: [
                "Adarsh Pratap Singh",
                "Aditya Raj",
                "Aayan Hasim",
                "Subham Kumar",
                "Tanmay Gupta",
            ],
            ojass_ids: [
                "OJASS26EIBT",
                "OJASS26HQIM",
                "OJASS26UZC4",
                "OJASS26E5G0",
                "OJASS26J1XV",
            ],
        },
    },
    {
        id: 21,
        event_name: "DRONE RACE CHALLENGE",
        winner: {
            team_name: "Team Uvira",
            members: [
                "Md Saddab Ansari",
                "Shreya Gorakhnath Mogal",
                "Yashraj Bajarang Lohat",
                "Shravani Sheshrao Kulkarni",
            ],
            ojass_ids: [
                "OJASS268AQ4",
                "OJASS264U67",
                "OJASS26IUZT",
                "OJASS26LYXC",
            ],
        },
        runner_up: {
            team_name: "Team Unity",
            members: [
                "Swastik Nandi",
                "Ayush Mukherjee",
                "Subhadeep Barik",
                "Debarshi Patikar",
            ],
            ojass_ids: [
                "OJASS261RDC",
                "OJASS26FV70",
                "OJASS26SJZU",
                "OJASS26BSDL",
            ],
        },
    },
    {
        id: 22,
        event_name: "NO GROUND ZONE",
        winner: {
            team_name: "Team Black Hawk",
            members: [
                "Avani Maheshwari",
                "Yash Labh",
                "Deepmala Deepak",
                "Sonu",
            ],
            ojass_ids: [
                "OJASS26CEB1",
                "OJASS26TKEQ",
                "OJASS2619UF",
                "OJASS26FWQ8",
            ],
        },
        runner_up: {
            team_name: "FlyingPredators",
            members: ["Anupam Nain", "Mohammad Fahad Siddiqui"],
            ojass_ids: ["OJASS2661AF", "OJASS263BLE"],
        },
    },
    {
        id: 23,
        event_name: "MOCK IPL AUCTION",
        winner: {
            team_name: "Individual",
            members: ["Aditi"],
            ojass_ids: ["OJASS26TSH7"],
        },
        runner_up: {
            team_name: "Individual",
            members: ["Tanishq Tanmay"],
            ojass_ids: ["OJASS264IJX"],
        },
    },
    {
        id: 24,
        event_name: "COZMO CLENCH",
        winner: {
            team_name: "Team Shoora",
            members: ["Piyush", "Jayesh Kadam", "Aasar Shukla"],
            ojass_ids: ["OJASS26N46V", "OJASS26W2SM", "OJASS26N4X0"],
        },
        runner_up: {
            team_name: "Team Velocity Vipers",
            members: [
                "Eklavya Kumar",
                "Yash Dandapat",
                "Pranav Sahu",
                "Sameer Kumar",
            ],
            ojass_ids: [
                "OJASS26O8PM",
                "OJASS26ZU7G",
                "OJASS26AA5A",
                "OJASS26AF04",
            ],
        },
    },
    {
        id: 25,
        event_name: "FINITE ELEMENT ANALYSIS",
        winner: {
            team_name: "Design Masters",
            members: ["Tanmay Gupta", "Aditya Raj"],
            ojass_ids: ["OJASS26J1XV", "OJASS26HQIM"],
        },
    },
    {
        id: 26,
        event_name: "START UP IDEATHON",
        winner: {
            team_name: "Field2Fiber",
            members: ["Prins Raj Prasad", "Anish", "Manoj Kumar", "Vivek"],
            ojass_ids: [
                "OJASS26DIC4",
                "OJASS26LHG3",
                "OJASS269O44",
                "OJASS26DRPM",
            ],
        },
        runner_up: {
            team_name: "Fest Pay",
            members: ["Mohak"],
            ojass_ids: ["OJASS26RAMP"],
        },
    },
    {
        id: 27,
        event_name: "BUSINESS SIMULATION",
        winner: {
            team_name: "Nexovo",
            members: ["Aditya Raj"],
            ojass_ids: ["OJASS26178M"],
        },
        runner_up: {
            team_name: "Techy Stars",
            members: ["Harsh", "Yash Sharma", "Satyam Sagar", "Aryan Sinha"],
            ojass_ids: ["OJASS261AG8", "OJASS26CP0N", "OJASS26YYJM", "OJASS265FCV"],
        },
    },
    {
        id: 28,
        event_name: "MAZE MARATHON",
        winner: {
            team_name: "Micro Wheels",
            members: [
                "Dhirendra Pratap Dindoure",
                "Shubham Gupta",
                "Shristy Shreya",
                "Dibyam Mohanty",
            ],
            ojass_ids: [
                "OJASS26PX90",
                "OJASS26XIUU",
                "OJASS269VWR",
                "OJASS26SHLI",
            ],
        },
        runner_up: {
            team_name: "Mechanix",
            members: [
                "Mridul Maurya",
                "Shreyas Shray",
                "Abhas Mishra",
                "Ketan Ranjan Sui",
            ],
            ojass_ids: [
                "OJASS26OJ4L",
                "OJASS260MC7",
                "OJASS260O5Q",
                "OJASS26QTT9",
            ],
        },
    },
    {
        id: 29,
        event_name: "AQUA RACE",
        winner: {
            team_name: "Team Shoora 2",
            members: ["Piyush Verma", "Aasar Shukla", "Jayesh Kadam"],
            ojass_ids: ["OJASS26N46V", "OJASS26N4X0", "OJASS26W2SM"],
        },
        runner_up: {
            team_name: "Team Shoora 1",
            members: ["Piyush Verma", "Jayesh Kadam", "Aasar Shukla"],
            ojass_ids: ["OJASS26N46V", "OJASS26W2SM", "OJASS26N4X0"],
        },
    },
    {
        id: 30,
        event_name: "ROBO SOCCER",
        winner: {
            team_name: "Metal Gears B",
            members: ["Somnath S", "Aman Chandrakar"],
            ojass_ids: ["OJASS26FYF9", "OJASS26BB5F"],
        },
        runner_up: {
            team_name: "Metal Gears A",
            members: ["Aryan Singh"],
            ojass_ids: ["OJASS261B08"],
        },
    },
    {
        id: 31,
        event_name: "KURUKSHETRA - ROBO WARS 3KG",
        winner: {
            team_name: "Team Unity",
            members: [
                "Tridibesh Jha",
                "Subhadeep Barik",
                "Ayush Mukherjee",
                "Debarshi Patikar",
            ],
            ojass_ids: [
                "OJASS26A6N5",
                "OJASS26SJZU",
                "OJASS26FV70",
                "OJASS26BSDL",
            ],
        },
        runner_up: {
            team_name: "Team T-Rex",
            members: [
                "Arnab Loha",
                "Nilanjana Datta",
                "Ranit Swarnakar",
                "Arisudan Nandi",
            ],
            ojass_ids: [
                "OJASS262VST",
                "OJASS26BBSV",
                "OJASS26PVDL",
                "OJASS262524",
            ],
        },
    },
    {
        id: 32,
        event_name: "KURUKSHETRA - ROBO WARS 8KG",
        winner: {
            team_name: "Team Shoora",
            members: ["Piyush Verma", "Aasar Shukla", "Jayesh Kadam"],
            ojass_ids: ["OJASS26N46V", "OJASS26N4X0", "OJASS26W2SM"],
        },
        runner_up: {
            team_name: "Metal Gears",
            members: ["Aryan Singh", "Somnath S", "Aman Chandrakar"],
            ojass_ids: ["OJASS261B08", "OJASS26FYF9", "OJASS26BB5F"],
        },
    },
    {
        id: 33,
        event_name: "KURUKSHETRA - ROBO WARS 15KG",
        winner: {
            team_name: "Team BloodFire",
            members: [],
            ojass_ids: [],
        },
    },
    {
        id: 34,
        event_name: "CINESCRIPT (BEST FILM)",
        winner: {
            team_name: "DAWNLIGHT PRODUCTIONS",
            members: ["Shivam Mishra", "Swaraj Sinha", "Abhideep Abhisek"],
            ojass_ids: ["OJASS26F8DW", "OJASS267EXS", "OJASS26EYQ3"],
        },
    },
    {
        id: 35,
        event_name: "CINESCRIPT (BEST SCREENPLAY)",
        winner: {
            team_name: "XT PRODUCTION",
            members: ["Shreyas", "Swastika", "Priyanshu"],
            ojass_ids: ["OJASS26OC1V", "OJASS266TTD", "OJASS267EFV"],
        },
    },
    {
        id: 36,
        event_name: "CINESCRIPT (BEST CINEMATOGRAPHY)",
        winner: {
            team_name: "BEYOND THE LENS",
            members: ["Aditya Raj", "Tanmay Gupta", "Abhijit Chandrakar"],
            ojass_ids: ["OJASS26HQIM", "OJASS26J1XV", "OJASS26SPTB"],
        },
    },
    {
        id: 37,
        event_name: "CINESCRIPT (BEST EDITOR)",
        winner: {
            team_name: "ALOO K PARATHE",
            members: ["Ayan Hasim", "Adarsh Pratap Singh", "Shubham Kumar"],
            ojass_ids: ["OJASS26UZC4", "OJASS26EIBT", "OJASS26E560"],
        },
    },
    {
        id: 38,
        event_name: "CINESCRIPT (BEST ACTOR)",
        winner: {
            team_name: "Group 3",
            members: ["Avani Maheshwari", "Deepmala Deepak", "Anant"],
            ojass_ids: ["OJASS26CEB1", "OJASS2619UF", "OJASS2645OK"],
        },
    },
    {
        id: 39,
        event_name: "LIGHTS CAMERA OJASS",
        winner: {
            team_name: "BEYOND THE LENS",
            members: ["Aditya Raj", "Tanmay Gupta", "Abhijit Chandrakar"],
            ojass_ids: ["OJASS26HQIM", "OJASS26J1XV", "OJASS26SPTB"],
        },
        runner_up: {
            team_name: "Hocus Phocus",
            members: ["Soham Deshpande", "Yash Labh"],
            ojass_ids: ["OJASS26ZI2C", "OJASS26TKEQ"],
        },
        second_runner_up: {
            team_name: "Omni Ojass",
            members: ["Shreejay", "Adarsh Pratap Singh", "Aayan Hasim"],
            ojass_ids: ["OJASS26E5G0", "OJASS26EIBT", "OJASS26UZC4"],
        },
    },
    {
        id: 40,
        event_name: "FRAMES AND TALES",
        winner: {
            team_name: "Adarsh Infinity",
            members: ["Adarsh Pratap Singh"],
            ojass_ids: ["OJASS26EIBT"],
        },
        runner_up: {
            team_name: "Hocus Phocus",
            members: ["Soham Deshpande"],
            ojass_ids: ["OJASS26ZI2C"],
        },
    },
];
