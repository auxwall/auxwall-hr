export const getDeviceById = async (id: number, DeviceModel) => {
    const result = await DeviceModel.findByPk(id);
    if (!result) {
        throw new Error("Device not found");
    }
    return result;
};
