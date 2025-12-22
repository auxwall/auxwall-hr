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
    const recentActivities = await Activity.findAll(
        {
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ["hr_action_type", "hr_description", "createdAt"]
        }
    )

    const alerts = {
        expiredDocuments,
        expiringSoon,
    };

    return {
        employees: {
            totalEmployees,
        },
        categories: {
            totalCategories,
        },
        documents: {
            totalDocuments,
            expiredDocuments,
            expiringSoon,
        },
        activities: recentActivities,
        alerts,

    };
};
