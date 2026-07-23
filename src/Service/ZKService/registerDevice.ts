export async function registerDevice(
    payload,
    ZKDevice
) {
    const serialNumber = payload.SN || payload.serialNumber;

    if (!serialNumber) {
        throw new Error("Serial Number missing");
    }

    let device = await ZKDevice.findOne({
        where: { serialNumber }
    });

    if (!device) {
        device = await ZKDevice.create({
            serialNumber,
            deviceName: payload.DeviceName,
            firmwareVersion: payload.FirmVer,
            ipAddress: payload.IPAddress,

            remoteRegistrationSupported: payload["~IsSupportQRcode"] === "1",
            faceSupported: payload.FaceFunOn === "1",
            fingerprintSupported: payload.FingerFunOn === "1",

            lastSeen: new Date()
        });
    } else {
        await device.update({
            deviceName: payload.DeviceName,
            firmwareVersion: payload.FirmVer,
            ipAddress: payload.IPAddress,
            lastSeen: new Date()
        });
    }

    return {
        registry: "ok",
        RegistryCode: serialNumber + "-" + Date.now()
    };
}