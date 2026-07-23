export async function getPendingCommand(
    serialNumber,
    ZkCommand
) {

    const command =
        await ZkCommand.findOne({
            where: {
                serialNumber,
                status: 'pending'
            }
        });

    if (!command) {
        return null;
    }

    command.status = 'sent';

    await command.save();

    return command.commandText;
}