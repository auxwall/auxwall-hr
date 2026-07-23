export async function createEnrollFace(
    staffId,
    serialNumber,
    ZkCommand
) {

    const cmdId = Date.now();

    const command =
        `C:${cmdId}:ENROLL_BIO TYPE=9\tNO=0\tPIN=${staffId}\tRETRY=3\tOVERWRITE=1\tMODE=1`;

    return await ZkCommand.create({
        serialNumber,
        commandText: command,
        status: 'pending'
    });
}