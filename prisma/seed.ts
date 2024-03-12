import { UserRole, CarColour } from "@prisma/client";
import { prisma } from "../src/lib/db/client.ts";

async function firstSeed() {
  const testface = await prisma.user.upsert({
    where: { email: "testface@prisma.io" },
    update: {},
    create: {
      email: "testface@prisma.io",
      name: "John Testface",
      comment: "This customer is part of the seed data.",
      role: UserRole.CUSTOMER,
      // SuperSecurePassword!
      passwordHash:
        "$2b$12$16VZC7zWzO1VYW.hENoWgusJLoQ9FDL/1jtzQ5J/SHFU2Rn.CDxTK",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@prisma.io" },
    update: {},
    create: {
      email: "admin@prisma.io",
      name: "Mike Admin",
      comment: "This administrator is part of the seed data.",
      role: UserRole.ADMIN,
      // HarnessAdminPower8
      passwordHash:
        "$2b$12$ZkfLh4nwP1lEPHFubTZXHOmK4J4S6gz9VkoLpgZsUjuA/YdabZpKm",
    },
  });

  await prisma.user.upsert({
    where: { email: "rep@prisma.io" },
    update: {},
    create: {
      email: "rep@prisma.io",
      name: "Shelly Representative",
      comment: "This representative is part of the seed data.",
      role: UserRole.REP,
      // ThisJobIsExhausting
      passwordHash:
        "$2b$12$u6T4DfeJTfLztnxfHUKvc.ehlVfRJmOeGa6.9tuCX15WYjKdJyw3q",
    },
  });

  const yulAirport = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Montréal-Trudeau International Airport",
      description:
        "Conveniently grab a car after your flight into Montréal. Enjoy the smooth, well-maintained roads that Québec has to offer.",
      streetAddress: "975 boul. Roméo-Vachon N",
      city: "Dorval",
      region: "QC",
      country: "CA",
      postalCode: "H4Y 1H1",
      iataAirportCode: "YUL",
      latitude: 45.4656587641663,
      longitude: -73.74548542331343,
      timezone: "America/Toronto",
    },
  });

  // This car has a freely-usable image
  // https://unsplash.com/photos/red-ferrari-458-italia-on-road-during-daytime-_DzW3MT-iIY
  const redFerrari = await prisma.car.upsert({
    where: { id: 1 },
    update: {},
    create: {
      branchId: yulAirport.id,
      photoUrl:
        "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      make: "Ferrari",
      model: "F8 Tributo",
      year: 2020,
      colour: CarColour.RED,
      seats: 2,
      description:
        "Enjoy the icon of luxury in this red Ferrari. May come with an increased risk of traffic tickets.",
      dailyPrice: 129900,
    },
  });

  // https://unsplash.com/photos/black-audi-a-4-on-road-during-daytime-aNwtUkpb3cU
  const practicalSUV = await prisma.car.upsert({
    where: { id: 2 },
    update: {},
    create: {
      branchId: yulAirport.id,
      make: "Toyota",
      model: "Highlander",
      year: 2021,
      colour: CarColour.BLACK,
      seats: 7,
      description:
        "Perfect for road trips with the whole family, this SUV seats 7 passengers and has all-wheel drive.",
      dailyPrice: 8900,
    },
  });

  // Prepaid gas accessory
  await prisma.accessory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Prepaid Gas Refill",
      description:
        "Skip the hassle of looking for a station on your way back - we'll fill up the tank for you!",
      price: 10000,
    },
  });

  const originalReservation = await prisma.reservation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      carId: redFerrari.id,
      holderId: testface.id,
      quotedPrice: 389700,
      plannedDepartureAt: new Date("2024-05-01T09:00:00.000-04:00"),
      plannedReturnAt: new Date("2024-05-03T19:00:00.000-04:00"),
    },
  });

  // Changed your mind on such an expensive car, same dates
  await prisma.reservation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      carId: practicalSUV.id,
      holderId: testface.id,
      replacesId: originalReservation.id,
      quotedPrice: 26700,
      plannedDepartureAt: new Date("2024-05-01T09:00:00.000-04:00"),
      plannedReturnAt: new Date("2024-05-03T19:00:00.000-04:00"),
    },
  });

  // Cancelled past reservation
  await prisma.reservation.upsert({
    where: { id: 3 },
    update: {},
    create: {
      carId: redFerrari.id,
      holderId: testface.id,
      quotedPrice: 129900,
      cancelled: true,
      plannedDepartureAt: new Date("2024-01-04T09:00:00.000-05:00"),
      plannedReturnAt: new Date("2024-01-04T19:00:00.000-05:00"),
    },
  });

  // Unchanged future reservation
  await prisma.reservation.upsert({
    where: { id: 4 },
    update: {},
    create: {
      carId: practicalSUV.id,
      holderId: testface.id,
      quotedPrice: 17800,
      plannedDepartureAt: new Date("2024-07-04T08:00:00.000-04:00"),
      plannedReturnAt: new Date("2024-07-05T18:00:00.000-04:00"),
    },
  });

  for (let i = 5; i <= 10; i++) {
    await prisma.reservation.upsert({
      where: { id: i },
      create: {
        carId: redFerrari.id,
        holderId: testface.id,
        quotedPrice: 10000 * i,
        plannedDepartureAt: new Date("2024-05-01T09:00:00.000-04:00"),
        plannedReturnAt: new Date("2024-05-03T19:00:00.000-04:00"),
      },
      update: {},
    });
  }

  await prisma.reservation.upsert({
    where: { id: 11 },
    create: {
      carId: redFerrari.id,
      holderId: testface.id,
      quotedPrice: 100000,
      plannedDepartureAt: new Date("2024-05-01T09:00:00.000-04:00"),
      pickedUpAt: new Date("2024-05-01T09:30:00.000-04:00"),
      plannedReturnAt: new Date("2024-05-03T19:00:00.000-04:00"),
      returnedAt: new Date("2024-05-03T19:00:00.000-04:00"),
    },
    update: {},
  });

  // No seeds for reservations with accessories yet because that's not a sprint 1 feature.
}

async function main() {
  await firstSeed();
}

main();
