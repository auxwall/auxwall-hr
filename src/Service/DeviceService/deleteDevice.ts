import { HRModels } from "../../types.js";

export const deleteDevice = async (id: number, hrModels: HRModels) => {
    const selectedDevice = await hrModels.Device.findByPk(id);
    if (!selectedDevice) {
        const error = new Error(`Device with ID ${id} not found.`);
        (error as any).status = 404;
        throw error;
    }
    await selectedDevice.destroy();
    return selectedDevice;
}