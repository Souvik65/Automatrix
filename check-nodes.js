const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const nodes = await prisma.node.findMany({
        where: { type: 'CRON_TRIGGER' }
    });
    console.log(`There are ${nodes.length} CRON_TRIGGER nodes in the database.`);
    console.log(nodes.map(n => ({ id: n.id, data: n.data, workflowId: n.workflowId })));
}

check().finally(() => prisma.$disconnect());
