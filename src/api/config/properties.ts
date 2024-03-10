import { PrismaClient } from '@prisma/client';
import env from 'dotenv';

const prisma: PrismaClient = new PrismaClient();
env.config();

class Properties {
    
    public async getProperty(propertyKey: string){
        try {
            const property = await prisma.property.findMany({ select: { value: true }, where: { key: propertyKey } });
            return property;
        } catch (error) {
            console.log(`[error]: ${error}`)
            return false;
        };
    };

};

export { Properties };
