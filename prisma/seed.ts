// seed.ts
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { Role } from 'src/auth-module/enums/role.enum';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function createSuperAdmin() {
  const SUPER_ADMIN_MOBILE = process.env.SUPER_ADMIN_MOBILE!;
  const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD!;

  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

  const superAdmin = await prisma.user.upsert({
    where: { mobile: SUPER_ADMIN_MOBILE },
    update: { role: Role.SuperAdmin, isActive: true },
    create: {
      mobile: SUPER_ADMIN_MOBILE,
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: Role.SuperAdmin,
      isActive: true,
    },
  });

  console.log(`✅ SuperAdmin ensured: ${superAdmin.mobile} (ID: ${superAdmin.id})`);
  return superAdmin;
}

async function createCategories() {
  const farsiCategories = [
    'برنامه‌نویسی وب',
    'هوش مصنوعی',
    'علم داده',
    'طراحی رابط کاربری',
    'امنیت سایبری',
    'توسعه موبایل',
    'رایانش ابری',
    'بلاکچین',
    'مدیریت پروژه',
    'دیجیتال مارکتینگ',
    'مهندسی نرم‌افزار',
    'شبکه‌های کامپیوتری',
    'پایگاه داده',
    'تست نرم‌افزار',
    'دواپس',
    'اینترنت اشیاء',
    'واقعیت افزوده',
    'بازی‌سازی',
    'الگوریتم و ساختمان داده',
    'معماری سیستم',
  ];

  let createdCount = 0;

  for (const name of farsiCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {}, // No updates needed if category already exists
      create: { name },
    });
    createdCount++;
  }

  console.log(`✅ Ensured ${createdCount} Farsi categories exist.`);
}

async function createCourses() {
  // Fetch existing categories to link courses
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });

  if (categories.length === 0) {
    console.warn('⚠️ No categories found. Skipping course seeding.');
    return;
  }

  const courseData = [
    {
      title: 'آموزش جامع React.js',
      description: 'یادگیری کامل ری‌اکت از مقدماتی تا پیشرفته',
      lecturer: 'علی محمدی',
      lecturerProfession: 'توسعه‌دهنده ارشد فرانت‌اند',
    },
    {
      title: 'مبانی Node.js و Express',
      description: 'ساخت APIهای RESTful با نود جی‌اس',
      lecturer: 'سارا احمدی',
      lecturerProfession: 'مهندس بک‌اند',
    },
    {
      title: 'هوش مصنوعی با Python',
      description: 'آشنایی با الگوریتم‌های یادگیری ماشین',
      lecturer: 'رضا کریمی',
      lecturerProfession: 'متخصص هوش مصنوعی',
    },
    {
      title: 'طراحی UI/UX مدرن',
      description: 'اصول طراحی رابط کاربری و تجربه کاربری',
      lecturer: 'مینا رضایی',
      lecturerProfession: 'طراح محصول',
    },
    {
      title: 'امنیت وب و تست نفوذ',
      description: 'شناخت آسیب‌پذیری‌ها و روش‌های محافظت',
      lecturer: 'امیر حسینی',
      lecturerProfession: 'متخصص امنیت سایبری',
    },
    {
      title: 'توسعه اپلیکیشن با React Native',
      description: 'ساخت اپ موبایل کراس‌پلتفرم',
      lecturer: 'نیما عباسی',
      lecturerProfession: 'توسعه‌دهنده موبایل',
    },
    {
      title: 'AWS و سرویس‌های ابری',
      description: 'پیاده‌سازی زیرساخت ابری مقیاس‌پذیر',
      lecturer: 'زهرا موسوی',
      lecturerProfession: 'معمار ابری',
    },
    {
      title: 'قراردادهای هوشمند Solidity',
      description: 'توسعه بلاکچین و DApp',
      lecturer: 'محمد جلالی',
      lecturerProfession: 'توسعه‌دهنده وب۳',
    },
    {
      title: 'مدیریت چابک پروژه',
      description: 'متدولوژی‌های Scrum و Kanban',
      lecturer: 'فاطمه نوری',
      lecturerProfession: 'مدیر محصول',
    },
    {
      title: 'سئو و بهینه‌سازی سایت',
      description: 'تکنیک‌های افزایش رتبه در گوگل',
      lecturer: 'حسن قاسمی',
      lecturerProfession: 'متخصص دیجیتال مارکتینگ',
    },
    {
      title: 'الگوهای طراحی در NestJS',
      description: 'معماری ماژولار و مقیاس‌پذیر',
      lecturer: 'علی محمدی',
      lecturerProfession: 'توسعه‌دهنده ارشد فرانت‌اند',
    },
    {
      title: 'شبکه‌های کامپیوتری +Network',
      description: 'مفاهیم پایه شبکه و پروتکل‌ها',
      lecturer: 'امیر حسینی',
      lecturerProfession: 'متخصص امنیت سایبری',
    },
    {
      title: 'PostgreSQL پیشرفته',
      description: 'بهینه‌سازی کوئری و طراحی دیتابیس',
      lecturer: 'سارا احمدی',
      lecturerProfession: 'مهندس بک‌اند',
    },
    {
      title: 'تست خودکار با Jest و Cypress',
      description: 'استراتژی‌های تست واحد و E2E',
      lecturer: 'رضا کریمی',
      lecturerProfession: 'متخصص هوش مصنوعی',
    },
    {
      title: 'CI/CD و Docker',
      description: 'اتوماسیون استقرار و کانتینرسازی',
      lecturer: 'نیما عباسی',
      lecturerProfession: 'توسعه‌دهنده موبایل',
    },
    {
      title: 'IoT با Raspberry Pi',
      description: 'پروژه‌های عملی اینترنت اشیاء',
      lecturer: 'محمد جلالی',
      lecturerProfession: 'توسعه‌دهنده وب۳',
    },
    {
      title: 'Unity و ساخت بازی دوبعدی',
      description: 'مقدمه‌ای بر بازی‌سازی',
      lecturer: 'مینا رضایی',
      lecturerProfession: 'طراح محصول',
    },
    {
      title: 'ساختمان داده و الگوریتم',
      description: 'حل مسائل پیچیده محاسباتی',
      lecturer: 'حسن قاسمی',
      lecturerProfession: 'متخصص دیجیتال مارکتینگ',
    },
    {
      title: 'معماری میکروسرویس',
      description: 'طراحی سیستم‌های توزیع‌شده',
      lecturer: 'زهرا موسوی',
      lecturerProfession: 'معمار ابری',
    },
    {
      title: 'TypeScript برای حرفه‌ای‌ها',
      description: 'تایپ‌سیستم پیشرفته و Genericها',
      lecturer: 'فاطمه نوری',
      lecturerProfession: 'مدیر محصول',
    },
  ];

  let ensuredCount = 0;
  for (let i = 0; i < courseData.length; i++) {
    const data = courseData[i];
    // Distribute courses across available categories in round-robin fashion
    const category = categories[i % categories.length];

    await prisma.course.upsert({
      where: { title: data.title },
      update: {}, // Preserve existing data on re-seed
      create: { ...data, categoryId: category.id },
    });
    ensuredCount++;
  }

  console.log(`✅ Ensured ${ensuredCount} courses exist.`);
}

async function createSections() {
  const courseData = [
    {
      title: 'آموزش جامع React.js',
      description: 'یادگیری کامل ری‌اکت از مقدماتی تا پیشرفته',
      id: 1,
      courseId: 1,
    },
    { title: 'مبانی Node.js و Express', description: 'ساخت APIهای RESTful با نود جی‌اس', id: 2, courseId: 2 },
  ];

  let ensuredCount = 0;
  for (let i = 0; i < courseData.length; i++) {
    const data = courseData[i];

    await prisma.section.upsert({
      where: { id: data.id },
      update: {},
      create: { ...data, courseId: data.courseId },
    });
    ensuredCount++;
  }

  console.log(`✅ Ensured ${ensuredCount} courses exist.`);
}

async function createParts() {
  const courseData = [
    {
      title: 'آموزش جامع React.js',
      description: 'یادگیری کامل ری‌اکت از مقدماتی تا پیشرفته',
      id: 1,
      sectionId: 1,
    },
    {
      title: 'مبانی Node.js و Express',
      description: 'ساخت APIهای RESTful با نود جی‌اس',
      id: 2,
      sectionId: 2,
    },
  ];

  let ensuredCount = 0;
  for (let i = 0; i < courseData.length; i++) {
    const data = courseData[i];

    await prisma.part.upsert({
      where: { id: data.id },
      update: {},
      create: { ...data, sectionId: data.sectionId },
    });
    ensuredCount++;
  }

  console.log(`✅ Ensured ${ensuredCount} courses exist.`);
}

async function main() {
  try {
    await createSuperAdmin();
    await createCategories();
    await createCourses();
    await createSections();
    await createParts();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
