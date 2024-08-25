import axios from "axios";
import { Properties } from "../../configs/properties";
import { property } from "../interfaces/configs/propertiesInterface";

export class EmailService {
    
    private properties: Properties = new Properties();

    public async sendSimpleMail(reciever: string, subject: string, message: string){
        console.log(`[info]: Procesando envio de correo`);
        const senderUrl: property[] = await this.properties.getProperty('Simple Mail URL');
        axios.post(senderUrl[0].value, { reciever, subject, message });
        console.log(`[info]: Correo enviado a Mercury para ser procesado`);
    };

    public async sendWelcomeMail(reciever: string, subject: string, userName: string){
        console.log(`[info]: Procesando envio de correo`);
        const [ senderUrl ]: property[] = await this.properties.getProperty('Welcome Mail URL');
        axios.post(senderUrl.value, { reciever, subject, userName });
        console.log(`[info]: Correo enviado a Mercury para ser procesado`);
    }

};
