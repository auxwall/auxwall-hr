import { Company, Staff, Categories, Document, Activities } from "./index.js";


//  (A Company can define many HR categories)
Company.hasMany(Categories, {
    foreignKey: 'company_id',
    as: 'hrCategories'
});

//  (Each Category must belong to a single Company)
Categories.belongsTo(Company, {
    foreignKey: 'company_id',
    as: 'company'
});

//  (A Staff member can create many Categories)
Staff.hasMany(Categories, {
    foreignKey: 'createdBy',
    as: 'createdCategories'
});

// (Each Category was created by a single Staff member)
Categories.belongsTo(Staff, {
    foreignKey: 'createdBy',
    as: 'creator'
});

// Categories has many Categories (as children)
Categories.hasMany(Categories, {
    foreignKey: 'parent_id',
    as: 'children'
});

// Categories belongs to one Categories (as a parent)
Categories.belongsTo(Categories, {
    foreignKey: 'parent_id',
    as: 'parent'
});

Document.belongsTo(Categories, {
    foreignKey: "categoryId",
    as: "category"
})


Document.belongsTo(Staff, {
    foreignKey: "uploadedBy",
    as: "uploader"
})

Document.belongsTo(Company, {
    foreignKey: "companyId",
    as: "company"
})

Document.belongsTo(Staff, {
    foreignKey: "staffId",
    as: "staff"
})

Activities.belongsTo(Staff, {
    foreignKey: "userId",
    as: "user"
})

Activities.belongsTo(Document, {
    foreignKey: "docId",
    as: "document"
})

