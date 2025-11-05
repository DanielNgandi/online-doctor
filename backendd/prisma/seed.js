// prisma/seed.js - UPDATED WITH COMPLETE DATA
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Delete existing doctors to avoid duplicates
  await prisma.doctor.deleteMany()

  // Create sample doctors with complete data
  const doctor1 = await prisma.doctor.create({
    data: {
      name: "Dr. John Smith",
      specialty: "Cardiology",
      contact: "+254712345678",
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
      hospital: "Nairobi Hospital",
      bio: "Experienced cardiologist with over 10 years of practice in heart diseases and treatments. Specialized in cardiac surgery and preventive cardiology.",
      experience: 10,
      ticketPrice: 2000,
      avgRating: 4.5,
      totalRating: 45,
      totalPatients: 1200
    }
  })

  const doctor2 = await prisma.doctor.create({
    data: {
      name: "Dr. Sarah Johnson",
      specialty: "Dermatology",
      contact: "+254723456789",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      hospital: "Kenyatta National Hospital",
      bio: "Skin specialist with expertise in dermatological conditions and cosmetic procedures. Certified by the International Dermatology Association.",
      experience: 8,
      ticketPrice: 1500,
      avgRating: 4.8,
      totalRating: 38,
      totalPatients: 850
    }
  })

  const doctor3 = await prisma.doctor.create({
    data: {
      name: "Dr. Michael Chen",
      specialty: "Pediatrics",
      contact: "+254734567890",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
      hospital: "Aga Khan Hospital",
      bio: "Pediatrician dedicated to children's health and wellness with 12 years of experience. Special interest in childhood nutrition and development.",
      experience: 12,
      ticketPrice: 1800,
      avgRating: 4.7,
      totalRating: 52,
      totalPatients: 1500
    }
  })

  const doctor4 = await prisma.doctor.create({
    data: {
      name: "Dr. Daniel Ngandi",
      specialty: "Cardiology",
      contact: "+254745678901",
      photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
      hospital: "General Kitui",
      bio: "Cardiologist with 7 years of experience in heart disease prevention and treatment. Committed to providing accessible cardiac care.",
      experience: 7,
      ticketPrice: 1200,
      avgRating: 4.3,
      totalRating: 28,
      totalPatients: 600
    }
  })

  const doctor5 = await prisma.doctor.create({
    data: {
      name: "Dr. Kangethe Ke",
      specialty: "Physician",
      contact: "+254756789012",
      photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
      hospital: "Nairobi General",
      bio: "General physician with comprehensive medical knowledge. Focus on holistic patient care and preventive medicine.",
      experience: 9,
      ticketPrice: 1000,
      avgRating: 4.6,
      totalRating: 34,
      totalPatients: 900
    }
  })

  console.log('Created 5 doctors with complete data')
  console.log('Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })