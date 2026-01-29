import moment from "moment";

export async function getDocuments(
    limit,
    offset,
    status,
    type,
    companyId,
    DocumentModel,
    StaffModel
) {
    const where: any = { companyId };

    if (status !== undefined && status !== null) {
        where.status = status;
    }

    if (type !== undefined && type !== null) {
        where.mimeType = type;
    }

    const result = await DocumentModel.findAndCountAll({
        where,
        include: [
            {
                model: StaffModel,
                as: 'assignedStaff',
                attributes: ['fullName'],
                required: false
            }
        ],
        limit,
        offset,
        order: [['id', 'DESC']]
    });

    return {
        count: result.count,
        rows: result.rows
    };
}
