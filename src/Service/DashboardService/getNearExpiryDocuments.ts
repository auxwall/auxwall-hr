import { Op } from "sequelize";

export async function getNearExpiryDocuments(documentsModels) {
    const today = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(today.getDate() + 60);
    const documents = await documentsModels.findAll(
        {
            limit: 15,
            order: [['expiryDate', 'ASC']],
            where: {
                status: "Active",
                expiryDate: {
                    [Op.gt]: today,
                    [Op.lt]: sixtyDaysLater
                }
            }
        }
    );
    return documents;
}
