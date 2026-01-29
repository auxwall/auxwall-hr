export async function getStaffByStatus(
    limit,
    offset,
    companyId,
    departmentId,
    status,
    StaffModel
) {
    try {
        const whereCondition: { [key: string]: any } = { companyId };

        if (status !== undefined && status !== null) {
            whereCondition.status = status;
        }

        if (departmentId !== undefined && departmentId !== null) {
            whereCondition.departmentId = Number(departmentId);
        }

        return await StaffModel.findAndCountAll({
            where: whereCondition,
            limit: Number(limit),
            offset: Number(offset),
            order: [['id', 'ASC']],
        });
    } catch (error) {
        throw error;
    }
}
