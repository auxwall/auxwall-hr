import { HRModels } from "../../types.js";

export async function editDevice(id: number, deviceData: any, hrModels: HRModels) {
    const { Company, Device } = hrModels;

    // 1. Basic validation
    if (!id) throw new Error("Device ID is required");

    // 2. Check if company exists
    if (deviceData.companyId) {
        const company = await Company.findByPk(deviceData.companyId);
        if (!company) throw new Error("Company not found");
    }

    // 3. Check if device exists
    const device = await Device.findByPk(id);
    if (!device) throw new Error("Device not found");

    // 4. Edit device
    const updatedDevice = await device.update({
        ...deviceData
    });

    return updatedDevice;
}