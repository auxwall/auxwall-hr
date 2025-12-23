export const logActivity = async (Model, { actionType, description, docId, userId, companyId }) => {
    try {
        await Model.create({
            actionType,
            description,
            docId,
            userId,
            companyId,
            createdAt: new Date()
        })
    } catch (error) {
        console.log("Failed to log activity", error);
    }

};