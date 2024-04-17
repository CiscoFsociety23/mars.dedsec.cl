import { PrismaClient } from '@prisma/client';
import { Users, UserBody, ServiceResponse, UserHash } from '../interfaces/models/users';
import bcrypt from 'bcryptjs';
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
        const passHash = bcrypt.hashSync(btoa(user.passwd), 10);
        const create: Users = await prisma.users.create({
            select: { id: true, name: true, lastName: true, email: true },
            data: { name: user.name, lastName: user.lastName, email: user.email, passwd: passHash }
        });
        console.log(`[info]: Se crea el usuario ${user.name} ${user.lastName}, correo: ${user.email}`);
        return { Message: 'Usuario creado', User: create };
    };

    public async updateUser(userId: number, userData: UserBody): Promise<ServiceResponse>{
        console.log(`[info]: Iniciando actualizacion de usuario con id ${userId}`);
        const updateUser: Users = await prisma.users.update({ where: { id: userId }, data: { ...userData }, select: { id: true, name: true, lastName: true, email: true }});
        console.log(`[info]: Se actualiza el usuario ${updateUser.name} ${updateUser.lastName}, correo: ${updateUser.email}`);
        return { Message: 'Usuario actualizado', User: updateUser };
    };

    public async deleteUser(userId: number): Promise<ServiceResponse>{
        console.log(`[info]: Iniciando eliminacion de usuario con id ${userId}`);
        const deleteUser = await prisma.users.delete({ where: { id: userId }, select: { id: true, name: true, lastName: true, email: true }});
        return { Message: 'Usuario Eliminado', User: deleteUser };
    };

    public async getAccount(userEmail: string): Promise<boolean>{
        console.log(`[info]: Verificando si existe la cuenta ${userEmail}`);
        const user: Users[] = await prisma.users.findMany({ select: { id: true, name: true, lastName: true, email: true }, where: { email: userEmail } });
        if(user.length > 0){
            console.log(`[info]: Usuario ${userEmail} encontrado con exito`);
            return true;
        } else {
            console.log(`[info]: Usuario ${userEmail} no registrado`);
            return false;
        };
    };

    private async getHashPasswd(userEmail: string): Promise<UserHash>{
        console.log(`[info]: Obteniendo contraseña actual del usuario ${userEmail}`);
        const [ getHash ]: UserHash[] = await prisma.users.findMany({ select: { passwd: true }, where: { email: userEmail } });
        return getHash;
    };

    private async checkPasswd(usrPasswd: string, currPasswd: string, user: string): Promise<boolean>{
        console.log(`[info]: Comparando contraseña de usuario ${user}`);
        const checker = bcrypt.compareSync(usrPasswd, currPasswd);
        if(checker){
            console.log(`[info]: Contraseña correcta`);
            return true;
        } else {
            console.log(`[error]: Contraseña incorrecta`);
            return false;
        }
    };

    public async checkAccess(email: string, passwd: string): Promise<boolean>{
        console.log(`[info]: Verificando accesos del usuario ${email}`);
        const checkAccount: boolean = await this.getAccount(email);
        if(checkAccount){
            const getHash = (await this.getHashPasswd(email)).passwd;
            const grantAccess: boolean = await this.checkPasswd(btoa(passwd), getHash, email);
            if(grantAccess){
                return true;
            } else {
                return false;
            };
        } else {
            return false;
        };
    };

};

export { UserService };
