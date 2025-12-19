import { Op } from "sequelize";
import { Document } from "../../models/index.js";


export async function getNearExpiryDocuments() {
    const today = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(today.getDate() + 60);
    const documents = await Document.findAll(
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
