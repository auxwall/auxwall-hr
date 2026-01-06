export const getPunchingDetails = async (limit, offset, Punching) => {
    const punching = await Punching.findAndCountAll({
        limit,
        offset,
        order: [
            ['id', 'ASC']
        ]
    });
    return punching;
}