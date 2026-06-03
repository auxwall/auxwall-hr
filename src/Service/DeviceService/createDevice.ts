import { HRModels } from "../../types.js";

export async function createDevice(deviceData: any, hrModels: HRModels) {
    const { Company, Device } = hrModels;

    // 1. Basic validation
    if (!deviceData.deviceName) throw new Error("Device name is required");
    if (!deviceData.serialNumber) throw new Error("Serial number is required");
    if (!deviceData.companyId) throw new Error("Company ID is required");

    // 2. Check if company exists
    const company = await Company.findByPk(deviceData.companyId);
    if (!company) throw new Error("Company not found");

    // 3. Create device
    const device = await Device.create(deviceData);

    return device;
}