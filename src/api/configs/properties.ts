import { PrismaClient } from '@prisma/client';
import env from 'dotenv';
import { property } from '../mars/interfaces/configs/propertiesInterface';

const prisma: PrismaClient = new PrismaClient();
env.config();

class Properties {
    
    public async getProperty(propertyKey: string): Promise<property[]> {
        console.log(`[info]: Obteniendo propiedad ${propertyKey}`);
        const property: property[] = await prisma.property.findMany({ select: { value: true }, where: { key: propertyKey } });
        return property;
    };

};

export { Properties };
