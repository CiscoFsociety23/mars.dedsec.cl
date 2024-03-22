import { PrismaClient } from '@prisma/client';
import { Users, UserBody, ServiceResponse } from '../interfaces/models/users';
const prisma = new PrismaClient();

class UserService {

    public async getUsers(): Promise<Users[]>{
        console.log(`[info]: Obteniendo listado de usuarios`);
        const users: Users[] = await prisma.users.findMany({ select: { id: true, name: true, lastName: true, email: true }, orderBy: { id: 'desc' }});
        console.log(`[info]: Usuarios encontrados ${users.length}`);
        return users;
    };

    public async createUser(user: UserBody): Promise<ServiceResponse>{
        console.log(`[info]: Iniciando creacion de usuario`);
        const create: Users = await prisma.users.create({ data: user, select: { id: true, name: true, lastName: true, email: true }});
        console.log(`[info]: Se crea el usuario ${user.name} ${user.lastName}, correo: ${user.email}`);
        return { Message: 'Usuario creado', User: create };
    };

    public async updateUser(userId: number, userData: UserBody): Promise<ServiceResponse>{
        console.log(`[info]: Iniciando actualizacion de usuario con id ${userId}`);
        const updateUser: Users = await prisma.users.update({ where: { id: userId }, data: { ...userData }, select: { id: true, name: true, lastName: true, email: true }});
        console.log(`[info]: Se actualiza el usuario ${updateUser.name} ${updateUser.lastName}, correo: ${updateUser.email}`);
        return { Message: 'Usuario actualizado', User: updateUser };
    };

    public async deleteUser(userId: number): Promise<ServiceResponse> {
        console.log(`[info]: Iniciando eliminacion de usuario con id ${userId}`);
        const deleteUser = await prisma.users.delete({ where: { id: userId }, select: { id: true, name: true, lastName: true, email: true }});
        return { Message: 'Usuario Eliminado', User: deleteUser };
    };

};

export { UserService };
