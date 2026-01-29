import cron from 'node-cron';
import { Op } from 'sequelize';
import { HRModels } from '../types.js';
import moment from "moment";

// Run every day at midnight
export const syncDocStatus = async (hrModels: HRModels) => {
    const { Document } = hrModels;
    const syncDoc = async () => {
        const today = moment().startOf("day");
        const expiringSoonThreshold = moment()
            .add(15, "days")
            .endOf("day");

        try {
            // 1. Expired documents
            await Document.update(
                { status: "Expired" },
                {
                    where: {
                        expiryDate: { [Op.lt]: today.toDate() }
                    }
                }
            );
            // 2. Expiring Soon
            await Document.update(
                { status: "Expiring Soon" },
                {
                    where: {
                        expiryDate: {
                            [Op.gte]: today.toDate(),
                            [Op.lte]: expiringSoonThreshold.toDate()
                        },
                        status: { [Op.ne]: "Expired" }
                    }
                }
            );

            // 3. Active (not expired or expiring soon)
            await Document.update(
                { status: "Active" },
                {
                    where: {
                        expiryDate: { [Op.gt]: expiringSoonThreshold.toDate() }
                    }
                }
            );

            console.log('Document statuses updated successfully.');
        } catch (err) {
            console.error('Error updating document statuses:', err);
        }
    }

    await syncDoc();
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily document status update...');
        await syncDoc();
    });
}