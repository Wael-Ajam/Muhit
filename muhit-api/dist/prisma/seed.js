"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient({
    log: ['warn', 'error'],
});
async function main() {
    const hashedPassword = await bcrypt.hash('Muhit@2026', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@muhitsolution.com' },
        update: {},
        create: {
            email: 'admin@muhitsolution.com',
            password: hashedPassword,
            name: 'Muhit Admin',
            role: 'admin',
        },
    });
    console.log('✅ Admin user created:', admin.email);
    const projectsData = [
        {
            slug: 'integrated-ad-campaign',
            category: 'motion',
            coverImage: '/projects/saba-design/cover-square.jpg',
            coverVideo: '/projects/saba-design/main-screens.mp4',
            isVideo: true,
            websiteUrl: 'https://www.wsm.org.sa',
            sortOrder: 1,
            titleAr: 'حملة إعلانية متكاملة',
            titleEn: 'Integrated Ad Campaign',
            descAr: 'حملة إعلانية شاملة تجمع بين الإبداع البصري والاستراتيجية التسويقية',
            descEn: 'A comprehensive advertising campaign combining visual creativity with marketing strategy',
            longDescAr: '',
            longDescEn: '',
            tags: ['tagMotion', 'tagDesign', 'tagMarketing'],
            gallery: [
                { type: 'image', src: '/projects/saba-design/cover.png', layout: 'full' },
                { type: 'video', src: '/projects/saba-design/award-v3.mp4', layout: 'half' },
                { type: 'video', src: '/projects/saba-design/award-v3-1.mp4', layout: 'half' },
                { type: 'video', src: '/projects/saba-design/award-v3-2.mp4', layout: 'full' },
                { type: 'video', src: '/projects/saba-design/award-v3-4.mp4', layout: 'half' },
                { type: 'video', src: '/projects/saba-design/ceremony-main.mp4', layout: 'half' },
                { type: 'video', src: '/projects/saba-design/ceremony-1.mp4', layout: 'half' },
            ],
        },
        {
            slug: 'full-brand-identity',
            category: 'design',
            coverImage: '/images/projects/project-2.webp',
            coverVideo: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4',
            isVideo: true,
            sortOrder: 2,
            titleAr: 'هوية بصرية متكاملة',
            titleEn: 'Full Brand Identity',
            descAr: 'تصميم هوية بصرية كاملة تعكس رؤية العلامة التجارية',
            descEn: 'Complete visual identity design reflecting the brand vision',
            longDescAr: '',
            longDescEn: '',
            tags: ['tagDesign', 'tagVisualIdentity', 'tagDevelopment'],
            gallery: [
                { type: 'video', src: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4', layout: 'full' },
                { type: 'image', src: '/images/projects/project-2.webp', layout: 'full' },
                { type: 'image', src: '/images/projects/project-5.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-6.webp', layout: 'half' },
            ],
        },
        {
            slug: 'motion-promo-video',
            category: 'motion',
            coverImage: '/images/projects/project-3.webp',
            coverVideo: 'https://cdn.pixabay.com/video/2022/03/09/110306-686957178_large.mp4',
            isVideo: true,
            sortOrder: 3,
            titleAr: 'فيديو موشن ترويجي',
            titleEn: 'Motion Promo Video',
            descAr: 'فيديو موشن جرافيك احترافي يعزز حضور علامتك التجارية',
            descEn: 'Professional motion graphics video to boost your brand presence',
            longDescAr: '',
            longDescEn: '',
            tags: ['tagMotion', 'tagDesign', 'tagMarketing'],
            gallery: [
                { type: 'video', src: 'https://cdn.pixabay.com/video/2022/03/09/110306-686957178_large.mp4', layout: 'full' },
                { type: 'image', src: '/images/projects/project-3.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-1.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-4.webp', layout: 'full' },
            ],
        },
        {
            slug: 'advanced-ecommerce-store',
            category: 'development',
            coverImage: '/images/projects/project-4.webp',
            coverVideo: null,
            isVideo: false,
            sortOrder: 4,
            titleAr: 'متجر إلكتروني متقدم',
            titleEn: 'Advanced E-Commerce Store',
            descAr: 'متجر إلكتروني متكامل بتجربة مستخدم سلسة',
            descEn: 'Full-featured e-commerce store with seamless UX',
            longDescAr: '',
            longDescEn: '',
            tags: ['tagDevelopment', 'tagDesign', 'tagEcommerce'],
            gallery: [
                { type: 'image', src: '/images/projects/project-4.webp', layout: 'full' },
                { type: 'image', src: '/images/projects/project-5.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-6.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-1.webp', layout: 'full' },
            ],
        },
        {
            slug: 'mobile-app',
            category: 'development',
            coverImage: '/images/projects/project-5.webp',
            coverVideo: null,
            isVideo: false,
            sortOrder: 5,
            titleAr: 'تطبيق جوال',
            titleEn: 'Mobile App',
            descAr: 'تطبيق جوال بتصميم عصري وأداء عالي',
            descEn: 'Mobile app with modern design and high performance',
            longDescAr: '',
            longDescEn: '',
            tags: ['tagDevelopment', 'tagDesign', 'tagUIUX'],
            gallery: [
                { type: 'image', src: '/images/projects/project-5.webp', layout: 'full' },
                { type: 'image', src: '/images/projects/project-2.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-3.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-6.webp', layout: 'full' },
            ],
        },
        {
            slug: 'social-media-campaign',
            category: 'marketing',
            coverImage: '/images/projects/project-6.webp',
            coverVideo: 'https://cdn.pixabay.com/video/2019/10/27/28602-370137024_large.mp4',
            isVideo: true,
            sortOrder: 6,
            titleAr: 'حملة سوشيال ميديا',
            titleEn: 'Social Media Campaign',
            descAr: 'حملة تسويقية مبتكرة على منصات التواصل الاجتماعي',
            descEn: 'Innovative marketing campaign across social media platforms',
            longDescAr: '',
            longDescEn: '',
            tags: ['tagMarketing', 'tagDesign', 'tagAdCampaigns'],
            gallery: [
                { type: 'video', src: 'https://cdn.pixabay.com/video/2019/10/27/28602-370137024_large.mp4', layout: 'full' },
                { type: 'image', src: '/images/projects/project-6.webp', layout: 'full' },
                { type: 'image', src: '/images/projects/project-1.webp', layout: 'half' },
                { type: 'image', src: '/images/projects/project-3.webp', layout: 'half' },
            ],
        },
    ];
    for (const data of projectsData) {
        const { tags, gallery, ...projectData } = data;
        const project = await prisma.project.upsert({
            where: { slug: projectData.slug },
            update: {},
            create: {
                ...projectData,
                tags: {
                    create: tags.map(tagKey => ({ tagKey })),
                },
                gallery: {
                    create: gallery.map((item, index) => ({
                        type: item.type,
                        src: item.src,
                        layout: item.layout,
                        sortOrder: index,
                    })),
                },
            },
        });
        console.log(`✅ Project seeded: ${project.titleEn}`);
    }
    const defaultCategories = [
        { slug: 'design', nameAr: 'تصميم', nameEn: 'Design', sortOrder: 0 },
        { slug: 'motion', nameAr: 'موشن', nameEn: 'Motion', sortOrder: 1 },
        { slug: 'development', nameAr: 'تطوير', nameEn: 'Development', sortOrder: 2 },
        { slug: 'marketing', nameAr: 'تسويق', nameEn: 'Marketing', sortOrder: 3 },
    ];
    for (const cat of defaultCategories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log('✅ Default categories seeded');
    const seoDefaults = [
        { key: 'siteTitle', value: 'محيط — وكالة إبداعية' },
        { key: 'siteDescription', value: 'وكالة إبداعية متكاملة متخصصة في التصميم والتطوير والتسويق الرقمي' },
        { key: 'ogTitle', value: 'محيط — وكالة إبداعية' },
        { key: 'ogDescription', value: 'نصمم هويات بصرية، نطور مواقع، وننتج محتوى إبداعي يميز علامتك التجارية' },
        { key: 'ogImage', value: '' },
        { key: 'favicon', value: '' },
    ];
    for (const setting of seoDefaults) {
        await prisma.siteSetting.upsert({
            where: { key: setting.key },
            update: {},
            create: setting,
        });
    }
    console.log('✅ SEO settings seeded');
    console.log('\n🎉 Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map