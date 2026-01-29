import { Op, Sequelize } from "sequelize";
import moment from "moment";
export async function getHrDashboard(hrModels, id) {
    const { Staff, Category, Document, Activity, Department, Company, AttendenceSummary } = hrModels;
    const totalEmployees = await Staff.findAll({
        include: [
            {
                model: Company,
                where: { id },
                through: { attributes: [] }
            }
        ],
        attributes: ['id'],
        raw: true
    });

    const totalEmployeesCount = totalEmployees.length;
    const totalCategories = await Category.count({ where: { companyId: id } });
    const totalDocuments = await Document.count({ where: { companyId: id } });
    const expiredDocuments = await Document.count({ where: { hr_status: "Expired", companyId: id } });
    const today = new Date();
    const fifteenDaysLater = new Date();
    fifteenDaysLater.setDate(today.getDate() + 15);
    const todayAttendence = await AttendenceSummary.count({ where: { attendence_date: today, status: "Present", companyId: id } });
    const activeStaff = await Staff.findAll({
        where: { status: true }, include: [{
            model: Company,
            where: { id },
            through: { attributes: [] }
        }]
    });
    const activeStaffCount = activeStaff.length;
    const missingDocuments = await Staff.findAll({
        where: {
            id: {
                [Op.notIn]: Sequelize.literal(
                    `(SELECT DISTINCT "hr_staff_id" FROM "hr_documents")`
                )
            },
            status: true
        },
        include: [{
            model: Company,
            where: { id },
            through: { attributes: [] }
        }]
    }
    );
    const missingDocumentsCount = missingDocuments.length;
    const expiringSoon = await Document.count({
        where: {
            companyId: id,
            hr_status: "Active",
            hr_expiry_date: {
                [Op.gt]: today,
                [Op.lte]: fifteenDaysLater
            }
        }
    });
    const validDocuments = await Document.count({
        where: {
            companyId: id,
            hr_status: "Active"
        }
    });
    // const totalTrainers = await Staff.count({ where: { isTrainer: true, companyId: id } });
    // const totalSales = await Staff.count({ where: { designation: "Sales", companyId: id } });
    // const totalFrontDesk = await Staff.count({ where: { designation: "Reception", companyId: id } });
    // const totalMaintenance = await Staff.count({ where: { designation: "Maintenance", companyId: id } });
    // const totalAdmins = await Staff.count({ where: { designation: "Admin", companyId: id } });
    const expiring = await Document.findAll({
        where: {
            companyId: id,
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
                attributes: ["fullName"]
            }
        ],
        limit: 5,
        attributes: ["hr_document_name", "hr_expiry_date", "hr_status"],
        order: [['hr_expiry_date', 'ASC']],
    });
    const recentActivities = await Activity.findAll(
        {
            where: {
                companyId: id
            },
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ["hr_action_type", "hr_description", "createdAt"]
        }
    )

    const allStaff = await Staff.findAll({
        include: [
            {
                model: Company,
                where: { id },           // filter by company
                through: { attributes: [] } // hide junction table fields
            },
            {
                model: Staff,
                as: 'creator',
                attributes: ['id', 'fullName']
            }
        ],
        attributes: ['id', 'departmentId'],
        raw: true
    });

    // 2️⃣ Count staff per distinct departmentId
    const countMap: Record<number, number> = {};

    allStaff.forEach(s => {
        if (s.departmentId != null) { // skip nulls
            countMap[s.departmentId] = (countMap[s.departmentId] || 0) + 1;
        }
    });

    // 3️⃣ Optional: get department names
    const departments = await Department.findAll({
        where: {
            company_id: id
        },
        attributes: ['id', 'department_name'],
        raw: true
    });

    // 4️⃣ Map department_name -> staff count
    const departmentCounts: Record<string, number> = {};
    departments.forEach(dept => {
        departmentCounts[dept.department_name] = countMap[dept.id] || 0;
    });

    console.log(departmentCounts);


    const documentTypes = await Document.findAll({
        attributes: [
            [Document.sequelize.fn('DISTINCT', Document.sequelize.col('hr_mime_type')), 'mimeType']
        ],
        where: {
            companyId: id // ensure it’s a number
        },
        raw: true
    });

    const mimeTypeList = documentTypes.map((dt: any) => dt.mimeType);

    console.log(mimeTypeList);


    const documents = await Document.findAll({
        where: {
            companyId: id // ensure it’s a number
        },
        raw: true
    });

    const docsWithStatus = documents.map((doc: any) => {
        const expiryDate = doc.expiryDate; // use your column name
        let computedStatus = doc.status;

        if (expiryDate) {
            const daysLeft = moment.utc(expiryDate).startOf('day').diff(moment().startOf('day'), 'days');

            if (daysLeft < 0) computedStatus = 'Expired';
            else if (daysLeft <= 7) computedStatus = 'Expiring in 7 days';
            else if (daysLeft <= 15) computedStatus = 'Expiring in 15 days';
            else if (daysLeft <= 30) computedStatus = 'Expiring in 30 days';
        }

        return {
            ...doc,
            computedStatus
        };
    });
    const expire7 = docsWithStatus.filter((doc: any) => doc.computedStatus === 'Expiring in 7 days');
    const expire15 = docsWithStatus.filter((doc: any) => doc.computedStatus === 'Expiring in 15 days');
    const expire30 = docsWithStatus.filter((doc: any) => doc.computedStatus === 'Expiring in 30 days');
    const countExpire7 = expire7.length;
    const countExpire15 = expire15.length;
    const countExpire30 = expire30.length;

    return {
        stats: {
            totalEmployees: totalEmployeesCount,
            activeStaff: activeStaffCount,
            totalCategories,
            totalDocuments,
            todayAttendence,
        },
        documents: {
            totalDocuments,
            validDocuments,
            missingDocuments: missingDocumentsCount,
            expiredDocuments,
            expiringSoonCount: expiringSoon,

        },
        expiringDocuments: {
            expire7,
            expire15,
            expire30,
            count: {
                countExpire7,
                countExpire15,
                countExpire30
            }
        },
        activities: recentActivities,
        expiringDetails: expiring,
        departmentCounts,
        documentTypes: mimeTypeList
    };
};
