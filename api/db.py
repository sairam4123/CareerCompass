from prisma import Prisma

async def db():
    prisma = Prisma()
    await prisma.connect()
    return prisma