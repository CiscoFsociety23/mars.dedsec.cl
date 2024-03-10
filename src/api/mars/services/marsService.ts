import { Properties } from "../../config/properties";

class MarsService {

    private properties: Properties = new Properties();

    public async getServiceStatus(){
        try {
            const serverStatus = await this.properties.getProperty('server_status');
            const serviceName = await this.properties.getProperty('service_name');
            return { service: Object(serviceName)[0].value, server: Object(serverStatus)[0].value };
        } catch (error) {
            console.log(`[error]: ${error}`);
            return false;
        };
    };

};

export { MarsService };
