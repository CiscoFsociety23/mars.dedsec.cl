import { Properties } from "@configs/properties";
import { ServiceStatus } from "@configs/servicesStatus";
import { property } from "@interfaces/config/propertiesInterface";
import { serviceStatus } from "@interfaces/config/servicesInterface";
import { serviceInformation } from "@interfaces/controllers/informationsInterface";

class MarsService {

    private properties: Properties = new Properties();
    private serviceStatus: ServiceStatus = new ServiceStatus();
    private servicesList: serviceStatus[] = [];

    private checkServiceList(serviceName: serviceStatus[]): void {
        if(!this.servicesList.find((service) => service.name === serviceName[0].name)){
            this.servicesList.push(serviceName[0]);
        };
    };

    public async getServiceStatus(): Promise<serviceInformation> {
        console.log(`[info]: Obteniendo estado del servicio`);
        const serverName: property[] = await this.properties.getProperty('Server Name');
        const userStatus: serviceStatus[] = await this.serviceStatus.getServiceStatus('User Service');
        this.checkServiceList(userStatus);
        return { Server: serverName[0].value , Services: this.servicesList };
    };

};

export { MarsService };
