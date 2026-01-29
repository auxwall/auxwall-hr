export async function getStaffByDepartment(
    limit,
    offset,
    companyId,
    departmentId,
    StaffModel
) {
    try {
        const whereCondition: { [key: string]: any } = { companyId };

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
