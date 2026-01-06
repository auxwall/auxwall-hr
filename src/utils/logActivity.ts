import { ModelStatic, Model } from 'sequelize';

interface ActivityParams {
    actionType: string;
    description: string;
    docId?: number;
    userId?: number;
    companyId?: number;
}

export const logActivity = async (Model: ModelStatic<Model<any, any>>, { actionType, description, docId, userId, companyId }: ActivityParams) => {
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