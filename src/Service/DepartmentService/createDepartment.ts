export async function createDepartment(department, DepartmentModel) {
    const newDepartment = await DepartmentModel.create(department);
    return newDepartment;
}