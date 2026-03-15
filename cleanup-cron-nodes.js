const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Delete the stale cron node that the user already removed from the canvas
    // but was left orphaned in the database.
    const deleted = await prisma.node.deleteMany({
        where: {
            type: 'CRON_TRIGGER',
        },
    });
    console.log(`Deleted ${deleted.count} stale CRON_TRIGGER node(s).`);
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
