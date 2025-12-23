import { Op } from "sequelize";

export async function getHrDashboard(hrModels) {
    const { Staff, Category, Document, Activity } = hrModels;
    const totalEmployees = await Staff.count();
    const totalCategories = await Category.count();
    const totalDocuments = await Document.count();
    const expiredDocuments = await Document.count({ where: { hr_status: "Expired" } });
    const today = new Date();
    const fifteenDaysLater = new Date();
    fifteenDaysLater.setDate(today.getDate() + 15);

    const expiringSoon = await Document.count({
        where: {
            hr_status: "Active",
            hr_expiry_date: {
                [Op.gt]: today,
                [Op.lte]: fifteenDaysLater
            }
        }
    });
    const expiring = await Document.findAll({
        where: {
            hr_status: "Active",
            hr_expiry_date: {
                [Op.gt]: today,
                [Op.lte]: fifteenDaysLater
            }
        },
        include: [
            {
                model: Staff,
                as: "assignedStaff",
                attributes: ["name"]
            }
        ],
        limit: 5,
        attributes: ["hr_document_name", "hr_expiry_date", "hr_status"],
        order: [['hr_expiry_date', 'ASC']],
    });
    const recentActivities = await Activity.findAll(
        {
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ["hr_action_type", "hr_description", "createdAt"]
        }
    )

    return {
        stats: {
            totalEmployees,
            totalCategories,
            totalDocuments,
        },
        documents: {
            totalDocuments,
            expiredDocuments,
            expiringSoonCount: expiringSoon,
        },
        activities: recentActivities,
        expiringDetails: expiring
    };
};
