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
    };

    public async sendValidationMail(reciever: string, subject: string, token: string){
        console.log(`[info]: Procesando envio de correo`);
        const [ senderUrl ]: property[] = await this.properties.getProperty('Validation Mail URL');
        const [ validationURL ]: property[] = await this.properties.getProperty('Validation URL');
        axios.post(senderUrl.value, { reciever, subject, validation_url: `${validationURL.value}?token=${token}` });
        console.log(`[info]: Correo enviado a Mercury para ser procesado`);
    };

};
