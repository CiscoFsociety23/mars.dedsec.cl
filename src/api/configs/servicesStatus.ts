import { PrismaClient } from '@prisma/client';
import env from 'dotenv';
import { serviceStatus } from '@interfaces/config/servicesInterface';

const prisma = new PrismaClient();
env.config();

class ServiceStatus {

    public async getServiceStatus(service: string): Promise<serviceStatus[]> {
        console.log(`[info]: Obteniendo estado ${service}`);
        const getServiceStatus: serviceStatus[] = await prisma.serviceStatus.findMany({ select: { name: true, status: { select: { name: true } } } });
        return getServiceStatus;
    };

};

export { ServiceStatus };
