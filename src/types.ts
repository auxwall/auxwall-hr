import { Model, ModelStatic } from 'sequelize';

export interface UserModels {
    Staff: ModelStatic<Model<any, any>>;
    Company: ModelStatic<Model<any, any>>;
    Punching: ModelStatic<Model<any, any>>;
}

export interface HRModels extends UserModels {
    Document: ModelStatic<Model<any, any>>;
    Category: ModelStatic<Model<any, any>>;
    Activity: ModelStatic<Model<any, any>>;
    StaffShift: ModelStatic<Model<any, any>>;
    AttendenceSummary: ModelStatic<Model<any, any>>;
}
