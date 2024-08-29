import { PrismaClient } from '@prisma/client';
import { Users, UserBody, ServiceResponse, UserHash } from '../interfaces/models/users';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { Properties } from '../../configs/properties';
const prisma = new PrismaClient();

class UserService {

    private property: Properties = new Properties();

    public async getUsers(): Promise<Users[]>{
        console.log(`[info]: Obteniendo listado de usuarios`);
        const users: Users[] = await prisma.users.findMany({ select: { id: true, name: true, lastName: true, email: true, profile: { select: { profile: true } } }, orderBy: { id: 'desc' }});
        console.log(`[info]: Usuarios encontrados ${users.length}`);
        return users;
    };

    public async getUserByEmail(userEmail: string): Promise<Users>{
        console.log(`[info]: Obteniendo usuario con el correo: ${userEmail}`);
        const [ user ]: Users[] = await prisma.users.findMany({
            select: { id: true, name: true, lastName: true, email: true, profile: { select: { profile: true } } },
            where: { email: userEmail }
        });
        console.log(`[info]: Usuario encontrado: { ${user.id}, ${user.name}, ${user.lastName}, ${user.email}, ${user.profile.profile} }`);
        return user;
    };

    public async createUser(user: UserBody): Promise<ServiceResponse>{
        console.log(`[info]: Iniciando creacion de usuario`);
        const passHash = bcrypt.hashSync(btoa(user.passwd), 10);
        const create: Users = await prisma.users.create({
            select: { id: true, name: true, lastName: true, email: true, profile: true },
            data: { name: user.name, lastName: user.lastName, email: user.email, passwd: passHash, profile: {connect: { id: user.profile }} }
        });
        const setStatus = await prisma.userStatus.create({
            data: { userId: create.id, statusId: 3 },
            select: { status: { select: { name: true } } }
        });
        console.log(`[info]: Se asigna el estado ${setStatus.status.name} a la cuenta ${create.email}`);
        console.log(`[info]: Se crea el usuario ${user.name} ${user.lastName}, correo: ${user.email}`);
        return { Message: 'Usuario creado', User: create };
    };

    public async updateUser(userId: number, userData: UserBody): Promise<ServiceResponse>{
        console.log(`[info]: Iniciando actualizacion de usuario con id ${userId}`);
        const passHash = bcrypt.hashSync(btoa(userData.passwd), 10);
        const updateUser: Users = await prisma.users.update({
            where: { id: userId }, 
            data: { name: userData.name, lastName: userData.lastName, email: userData.email, passwd: passHash, profile: {connect: { id: userData.profile }} }, 
            select: { id: true, name: true, lastName: true, email: true, profile: true }
        });
        console.log(`[info]: Se actualiza el usuario ${updateUser.name} ${updateUser.lastName}, correo: ${updateUser.email}`);
        return { Message: 'Usuario actualizado', User: updateUser };
    };

    public async deleteUser(userId: number): Promise<ServiceResponse>{
        console.log(`[info]: Iniciando eliminacion de usuario con id ${userId}`);
        const [ getStatus ] = await prisma.userStatus.findMany({ where: { userId: userId } });
        const deleteStatus = await prisma.userStatus.delete({ where: { id: getStatus.id } });
        console.log(`[info]: Eliminando status del usuario con id: ${userId}`);
        const deleteUser = await prisma.users.delete({ where: { id: userId }, select: { id: true, name: true, lastName: true, email: true, profile: true }});
        return { Message: 'Usuario Eliminado', User: deleteUser };
    };

    public async getAccount(userEmail: string): Promise<boolean>{
        console.log(`[info]: Verificando si existe la cuenta ${userEmail}`);
        const user: Users[] = await prisma.users.findMany({ select: { id: true, name: true, lastName: true, email: true, profile: { select: { profile: true } } }, where: { email: userEmail } });
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

    public async getToken(client: string): Promise<string>{
        console.log('[info]: Realizando solicitud de Token');
        const [ jupiter_url ] = await this.property.getProperty('Jupiter URL');
        const [ jupiter_user ] = await this.property.getProperty('Jupiter User');
        const [ jupiter_passwd ] = await this.property.getProperty('Jupiter Passwd');
        const profile = await this.getProfile(client);
        const { data } = await axios.get(`${jupiter_url.value}?user=${jupiter_user.value}&passwd=${jupiter_passwd.value}&client=${client}&profile=${profile}`);
        console.log('[info]: Token obtenido ok');
        return data.token;
    };

    private async getProfile(email: string): Promise<String>{
        console.log(`[info]: Obtenindo perfil de: ${email}`);
        const account: Users[] = await prisma.users.findMany({
            select: { id: true, name: true, lastName: true, email: true, profile: { select: { profile: true } } }, 
            where: { email: email }
        });
        console.log(`[info]: Perfil obtenido: ${account[0].profile.profile}`)
        return account[0].profile.profile;
    };

    public async getStatusAccount(email: string) {
        console.log(`[info]: Obteniendo estado de la cuenta ${email}`);
        const account: Promise<Users> = this.getUserByEmail(email);
        const [ status ] = await prisma.userStatus.findMany({
            select: { status: { select: { name: true } } },
            where: { userId: (await account).id }
        });
        console.log(`[info]: El estado de la cuenta ${email} es ${status.status.name}`);
        if (status.status.name === 'PENDING'){
            return false;
        } else {
            return true;
        };
    };

    public async getValidationToken(email: string) {
        console.log(`[info]: Solicitud de token para la cuenta ${email}`);
        const [ jupiter_url ] = await this.property.getProperty('Jupiter URL');
        const [ jupiter_user ] = await this.property.getProperty('Jupiter User');
        const [ jupiter_passwd ] = await this.property.getProperty('Jupiter Passwd');
        const { data } = await axios.get(`${jupiter_url.value}/validationToken?user=${jupiter_user.value}&passwd=${jupiter_passwd.value}&client=${email}`);
        return data;
    };

};

export { UserService };
