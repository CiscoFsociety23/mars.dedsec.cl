import axios, { AxiosHeaders } from "axios";
import { Properties } from "../../configs/properties";
import { property } from "../interfaces/configs/propertiesInterface";

export class EmailService {
    
    private properties: Properties = new Properties();

    public async sendSimpleMail(reciever: string, subject: string, message: string){
        console.log(`[info]: Procesando envio de correo`);
        const senderUrl: property[] = await this.properties.getProperty('Simple Mail URL');
        const token_mars: property[] = await this.properties.getProperty("Mars Admin Token");
        const headers: AxiosHeaders = new AxiosHeaders({ Authorization: `Bearer ${token_mars[0].value}` })
        axios.post(senderUrl[0].value, { reciever, subject, message }, { headers });
        console.log(`[info]: Correo enviado a Mercury para ser procesado`);
    };

    public async sendWelcomeMail(reciever: string, subject: string, userName: string){
        console.log(`[info]: Procesando envio de correo`);
        const [ senderUrl ]: property[] = await this.properties.getProperty('Welcome Mail URL');
        const token_mars: property[] = await this.properties.getProperty("Mars Admin Token");
        const headers: AxiosHeaders = new AxiosHeaders({ Authorization: `Bearer ${token_mars[0].value}` })
        axios.post(senderUrl.value, { reciever, subject, userName }, { headers });
        console.log(`[info]: Correo enviado a Mercury para ser procesado`);
    };

    public async sendValidationMail(reciever: string, subject: string, token: string){
        console.log(`[info]: Procesando envio de correo`);
        const [ senderUrl ]: property[] = await this.properties.getProperty('Validation Mail URL');
        const [ validationURL ]: property[] = await this.properties.getProperty('Validation URL');
        const token_mars: property[] = await this.properties.getProperty("Mars Admin Token");
        const headers: AxiosHeaders = new AxiosHeaders({ Authorization: `Bearer ${token_mars[0].value}` })
        axios.post(senderUrl.value, { reciever, subject, validation_url: `${validationURL.value}?token=${token}` }, { headers });
        console.log(`[info]: Correo enviado a Mercury para ser procesado`);
    };

};
