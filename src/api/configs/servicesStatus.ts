import { PrismaClient } from '@prisma/client';
import env from 'dotenv';
import { serviceStatus } from '../mars/interfaces/configs/servicesInterface';

const prisma = new PrismaClient();
env.config();

class ServiceStatus {

    public async getServiceStatus(service: string): Promise<serviceStatus[]> {
        try {
            prisma.$connect();
            console.log(`[info]: Obteniendo estado ${service}`);
            const getServiceStatus: serviceStatus[] = await prisma.serviceStatus.findMany({ select: { name: true, status: { select: { name: true } } } });
            return getServiceStatus;
        } finally {
            prisma.$disconnect();
        };
    };

};

export { ServiceStatus };
