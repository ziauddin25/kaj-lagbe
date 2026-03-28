import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { id: 'electrician', name: 'Electrician', nameBn: 'ইলেকট্রিশিয়ান', basePrice: 300, icon: 'Zap' },
    { id: 'plumber', name: 'Plumber', nameBn: 'প্লাম্বার', basePrice: 250, icon: 'Droplets' },
    { id: 'ac-repair', name: 'AC Repair', nameBn: 'এসি মেরামত', basePrice: 500, icon: 'Wind' },
    { id: 'cleaner', name: 'Cleaner', nameBn: 'ক্লিনার', basePrice: 200, icon: 'Sparkles' },
    { id: 'tutor', name: 'Tutor', nameBn: 'টিউটর', basePrice: 400, icon: 'GraduationCap' },
    { id: 'mechanic', name: 'Mechanic', nameBn: 'মেকানিক', basePrice: 350, icon: 'Wrench' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  console.log('✅ Categories seeded');

  const providers = [
    { name: 'রহিম উদ্দিন', phone: '8801710000001', area: 'মিরপুর', basePrice: 300, lat: 23.8042, lng: 90.3687 },
    { name: 'করিম শেখ', phone: '8801710000002', area: 'উত্তরা', basePrice: 250, lat: 23.8759, lng: 90.3795 },
    { name: 'সুমন হোসেন', phone: '8801710000003', area: 'ধানমন্ডি', basePrice: 500, lat: 23.7461, lng: 90.3742 },
    { name: 'জাহিদ হাসান', phone: '8801710000004', area: 'গুলশান', basePrice: 350, lat: 23.7925, lng: 90.4078 },
    { name: 'আল-আমিন', phone: '8801710000005', area: 'বনানী', basePrice: 400, lat: 23.7937, lng: 90.4066 },
  ];

  for (const p of providers) {
    const user = await prisma.user.upsert({
      where: { phone: p.phone },
      update: {},
      create: {
        name: p.name,
        phone: p.phone,
        role: 'PROVIDER',
      },
    });

    await prisma.provider.upsert({
      where: { userId: user.id },
      update: {
        area: p.area,
        basePrice: p.basePrice,
        latitude: p.lat,
        longitude: p.lng,
        status: 'AVAILABLE',
        isApproved: true,
      },
      create: {
        userId: user.id,
        area: p.area,
        basePrice: p.basePrice,
        latitude: p.lat,
        longitude: p.lng,
        status: 'AVAILABLE',
        isApproved: true,
      },
    });

    console.log(`✅ Provider seeded: ${p.name}`);
  }

  console.log('🎉 All seed data created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
