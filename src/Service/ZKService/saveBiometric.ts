export async function saveBiometric(
    payload,
    ZkBiometric
) {

    return await ZkBiometric.create({

        staffId: payload.PIN,

        biometricType: payload.TYPE,

        templateData: payload.TMP,

        bioPhoto: payload.BIOPHOTO,

        majorVersion: payload.MAJOR_VER,

        minorVersion: payload.MINOR_VER

    });
}