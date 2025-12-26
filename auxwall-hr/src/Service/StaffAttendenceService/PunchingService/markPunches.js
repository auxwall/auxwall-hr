export const markPunches = async (punchingData, Punching) => {
    const punching = await Punching.create(punchingData);
    return punching;
}